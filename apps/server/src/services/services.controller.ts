import {
    DockerEngineContainerSummary,
    PortainerApiStack,
    ServiceActionResponse,
    ServiceContainer,
    ServiceHealth,
    ServiceLink,
    ServiceLinkConfig,
    ServiceLinkConfigResponse,
    ServiceLinkConfigUpdate,
    ServicePort,
    ServicesResponse,
    ServicesSummary,
    ServiceStack,
} from "@homeremote/types";
import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    Param,
    Put,
    Query,
    Request,
    UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { promises as fs } from "fs";
import got from "got";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import type { AuthenticatedRequest } from "../login/LoginRequest.types";

interface EnvServiceLink {
    label: string;
    icon: string;
    url: string;
}

type LinkStore = Record<string, ServiceLinkConfigUpdate>;

const API_ROOT = "/v1.41/containers";
const DEFAULT_SOCKET_PATH = "/var/run/docker.sock";

const buildDockerUrl = (socketPath: string, path: string): string =>
    `http://unix:${socketPath}:${API_ROOT}${path}`;

const stripLeadingSlash = (name: string): string =>
    name.startsWith("/") ? name.slice(1) : name;

const deriveContainerHealth = (
    state: string,
    status: string
): ServiceHealth => {
    if (state !== "running") {
        return "stopped";
    }
    return /unhealthy/i.test(status) ? "degraded" : "running";
};

const deriveStackHealth = (
    containers: ServiceContainer[],
    portainerStatus?: number
): ServiceHealth => {
    if (containers.length === 0) {
        return portainerStatus === 1 ? "running" : "stopped";
    }
    const stopped = containers.filter((c) => c.health === "stopped").length;
    const degraded = containers.filter((c) => c.health === "degraded").length;
    if (stopped === containers.length) {
        return "stopped";
    }
    if (stopped > 0 || degraded > 0) {
        return "degraded";
    }
    return "running";
};

const mapPorts = (raw: DockerEngineContainerSummary): ServicePort[] => {
    const ports = (raw.Ports ?? []).map((port) => ({
        publicPort: port.PublicPort,
        privatePort: port.PrivatePort,
        type: port.Type,
        // internal = not published to the host (no reachable public port)
        internal: !(port.PublicPort && port.IP === "0.0.0.0"),
    }));
    // De-duplicate ports that Docker lists once per IP family (IPv4 + IPv6).
    const seen = new Set<string>();
    return ports.filter((port) => {
        const key = `${port.publicPort ?? ""}:${port.privatePort ?? ""}/${
            port.type ?? ""
        }`;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
};

const mapContainer = (raw: DockerEngineContainerSummary): ServiceContainer => {
    const name = stripLeadingSlash(raw.Names?.[0] ?? "");
    const project = raw.Labels?.["com.docker.compose.project"] ?? undefined;
    return {
        Id: raw.Id,
        Name: name,
        Image: raw.Image,
        state: raw.State,
        status: raw.Status,
        health: deriveContainerHealth(raw.State, raw.Status),
        createdAt: raw.Created,
        ports: mapPorts(raw),
        project,
    };
};

const firstPublicPort = (
    containers: ServiceContainer[]
): number | undefined => {
    for (const container of containers) {
        const published = container.ports.find(
            (port) => !port.internal && port.publicPort
        );
        if (published?.publicPort) {
            return published.publicPort;
        }
    }
    return undefined;
};

@Controller("api/services")
export class ServicesController {
    private readonly logger: Logger;
    private readonly socketPath: string;
    private readonly dockerBaseUrl: string;
    private readonly portainerBaseUrl: string;
    private readonly portainerApiKey: string;
    private readonly icons: Record<string, string>;
    private readonly envServiceLinks: EnvServiceLink[];
    private readonly configPath: string;

    constructor(private configService: ConfigService) {
        this.logger = new Logger(ServicesController.name);
        this.socketPath =
            this.configService.get<string>("DOCKER_SOCKET_PATH") ||
            DEFAULT_SOCKET_PATH;
        this.dockerBaseUrl =
            this.configService.get<string>("DOCKER_BASE_URL") || "";
        this.portainerBaseUrl =
            this.configService.get<string>("PORTAINER_BASE_URL") || "";
        this.portainerApiKey =
            this.configService.get<string>("PORTAINER_API_KEY") || "";
        this.icons = this.parseIcons(
            this.configService.get<string>("DOCKER_ICONS") ?? ""
        );
        this.envServiceLinks = this.parseServiceLinks(
            this.configService.get<string>("SERVICE_LINKS") ?? ""
        );
        this.configPath =
            this.configService.get<string>("SERVICES_CONFIG_PATH") || "";
    }

    private parseIcons(iconsConfig: string): Record<string, string> {
        if (!iconsConfig) {
            return {};
        }
        const entries = iconsConfig.split(";").map((str) => {
            const [label, icon] = str.split(",");
            return [label, icon] as const;
        });
        return Object.fromEntries(entries);
    }

    private parseServiceLinks(config: string): EnvServiceLink[] {
        if (!config) {
            return [];
        }
        return config
            .split(";")
            .map((str) => {
                const [label, icon, url] = str.split(",");
                return { label, icon, url };
            })
            .filter((link) => link.label);
    }

    private async readLinkStore(): Promise<LinkStore> {
        if (!this.configPath) {
            return {};
        }
        try {
            const raw = await fs.readFile(this.configPath, "utf-8");
            return JSON.parse(raw) as LinkStore;
        } catch (err) {
            // Missing file simply means no overrides have been saved yet.
            if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
                this.logger.error(`Failed to read link config: ${err}`);
            }
            return {};
        }
    }

    private async writeLinkStore(store: LinkStore): Promise<void> {
        if (!this.configPath) {
            throw new Error("SERVICES_CONFIG_PATH is not configured");
        }
        await fs.writeFile(
            this.configPath,
            JSON.stringify(store, null, 2),
            "utf-8"
        );
    }

    private applyOverride(
        name: string,
        override: ServiceLinkConfigUpdate,
        discovered: ServiceLinkConfig
    ): ServiceLinkConfig {
        const label = discovered.label ?? name;
        const icon = discovered.icon ?? this.icons[name];
        if (override.type === "none") {
            return { type: "none", label, icon };
        }
        if (override.type === "port" && override.port) {
            return {
                type: "port",
                port: override.port,
                label,
                icon,
                url: this.dockerBaseUrl
                    ? `${this.dockerBaseUrl}:${override.port}`
                    : undefined,
            };
        }
        if (override.type === "fqdn" && override.fqdn) {
            const url = /^https?:\/\//.test(override.fqdn)
                ? override.fqdn
                : `https://${override.fqdn}`;
            return { type: "fqdn", fqdn: override.fqdn, label, icon, url };
        }
        return discovered;
    }

    private async fetchContainers(): Promise<DockerEngineContainerSummary[]> {
        try {
            return await got(
                buildDockerUrl(this.socketPath, "/json?all=true"),
                { enableUnixSockets: true }
            ).json<DockerEngineContainerSummary[]>();
        } catch (err) {
            this.logger.error(`Failed to read docker socket: ${err}`);
            return [];
        }
    }

    private async fetchStacks(): Promise<PortainerApiStack[]> {
        if (!this.portainerBaseUrl) {
            return [];
        }
        try {
            return await got(`${this.portainerBaseUrl}/api/stacks`, {
                headers: { "X-API-KEY": this.portainerApiKey },
            }).json<PortainerApiStack[]>();
        } catch (err) {
            this.logger.error(`Failed to read Portainer stacks: ${err}`);
            return [];
        }
    }

    private resolveLink(
        stackName: string,
        containers: ServiceContainer[],
        linkStore: LinkStore = {}
    ): ServiceLinkConfig {
        const discovered = this.discoverLink(stackName, containers);
        const override = linkStore[stackName.toLowerCase()];
        if (override) {
            return this.applyOverride(stackName, override, discovered);
        }
        return discovered;
    }

    private discoverLink(
        stackName: string,
        containers: ServiceContainer[]
    ): ServiceLinkConfig {
        const envLink = this.envServiceLinks.find(
            (link) => link.label.toLowerCase() === stackName.toLowerCase()
        );
        if (envLink) {
            return {
                type: "fqdn",
                url: envLink.url,
                label: envLink.label,
                icon: envLink.icon || this.icons[stackName],
            };
        }
        const port = firstPublicPort(containers);
        if (port && this.dockerBaseUrl) {
            return {
                type: "port",
                port,
                url: `${this.dockerBaseUrl}:${port}`,
                label: stackName,
                icon: this.icons[stackName],
            };
        }
        return { type: "none", label: stackName };
    }

    private buildStack(
        id: string,
        name: string,
        source: ServiceStack["source"],
        containers: ServiceContainer[],
        options: {
            endpointId?: number;
            portainerStatus?: number;
            linkStore?: LinkStore;
        } = {}
    ): ServiceStack {
        return {
            Id: id,
            Name: name,
            source,
            endpointId: options.endpointId,
            portainerStatus: options.portainerStatus,
            health: deriveStackHealth(containers, options.portainerStatus),
            containers,
            link: this.resolveLink(name, containers, options.linkStore),
        };
    }

    private aggregate(
        rawContainers: DockerEngineContainerSummary[],
        stacks: PortainerApiStack[],
        linkStore: LinkStore = {}
    ): { stacks: ServiceStack[]; serviceLinks: ServiceLink[] } {
        const containers = rawContainers.map(mapContainer);

        // Group containers by compose project.
        const byProject = new Map<string, ServiceContainer[]>();
        const standaloneContainers: ServiceContainer[] = [];
        for (const container of containers) {
            if (container.project) {
                const key = container.project.toLowerCase();
                const list = byProject.get(key) ?? [];
                list.push(container);
                byProject.set(key, list);
            } else {
                standaloneContainers.push(container);
            }
        }

        const portainerStacks: ServiceStack[] = [];
        for (const stack of stacks) {
            const key = stack.Name.toLowerCase();
            const stackContainers = byProject.get(key) ?? [];
            byProject.delete(key);
            portainerStacks.push(
                this.buildStack(
                    String(stack.Id),
                    stack.Name,
                    "portainer",
                    stackContainers,
                    {
                        endpointId: stack.EndpointId,
                        portainerStatus: stack.Status,
                        linkStore,
                    }
                )
            );
        }

        // Compose projects that are not managed by Portainer.
        const composeStacks: ServiceStack[] = [];
        for (const [, stackContainers] of byProject) {
            const name = stackContainers[0].project as string;
            composeStacks.push(
                this.buildStack(
                    `standalone:${name}`,
                    name,
                    "standalone",
                    stackContainers,
                    { linkStore }
                )
            );
        }

        // Containers without any compose project become single-container stacks.
        const singleStacks: ServiceStack[] = standaloneContainers.map(
            (container) =>
                this.buildStack(
                    `standalone:${container.Name}`,
                    container.Name,
                    "standalone",
                    [container],
                    { linkStore }
                )
        );

        const byName = (a: ServiceStack, b: ServiceStack): number =>
            a.Name.localeCompare(b.Name);

        const orderedStacks = [
            ...portainerStacks.sort(byName),
            ...composeStacks.sort(byName),
            ...singleStacks.sort(byName),
        ];

        const seenLinks = new Set<string>();
        const serviceLinks: ServiceLink[] = [];
        for (const stack of orderedStacks) {
            if (stack.link?.url && stack.link.label) {
                const label = stack.link.label;
                if (!seenLinks.has(label.toLowerCase())) {
                    seenLinks.add(label.toLowerCase());
                    serviceLinks.push({
                        label,
                        url: stack.link.url,
                        icon: stack.link.icon ?? "",
                    });
                }
            }
        }

        return { stacks: orderedStacks, serviceLinks };
    }

    private buildSummary(stacks: ServiceStack[]): ServicesSummary {
        return stacks.reduce<ServicesSummary>(
            (summary, stack) => {
                if (stack.health === "running") {
                    summary.healthy += 1;
                } else if (stack.health === "degraded") {
                    summary.degraded += 1;
                } else {
                    summary.stopped += 1;
                }
                return summary;
            },
            { healthy: 0, degraded: 0, stopped: 0 }
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getServices(
        @Request() req: AuthenticatedRequest
    ): Promise<ServicesResponse> {
        this.logger.verbose(`[${req.user.name}] GET to /api/services`);

        try {
            const [rawContainers, stacks, linkStore] = await Promise.all([
                this.fetchContainers(),
                this.fetchStacks(),
                this.readLinkStore(),
            ]);

            if (rawContainers.length === 0 && stacks.length === 0) {
                throw new Error("no data from docker socket or Portainer");
            }

            const { stacks: aggregatedStacks, serviceLinks } = this.aggregate(
                rawContainers,
                stacks,
                linkStore
            );

            return {
                status: "received",
                stacks: aggregatedStacks,
                serviceLinks,
                summary: this.buildSummary(aggregatedStacks),
            };
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    private async postToDockerSocket(path: string): Promise<void> {
        await got(buildDockerUrl(this.socketPath, path), {
            method: "POST",
            enableUnixSockets: true,
        }).json<unknown>();
    }

    private async postToPortainer(path: string): Promise<void> {
        await got
            .post(`${this.portainerBaseUrl}${path}`, {
                headers: { "X-API-KEY": this.portainerApiKey },
            })
            .json<unknown>();
    }

    @UseGuards(JwtAuthGuard)
    @Get("container/:action/:id")
    async controlContainer(
        @Request() req: AuthenticatedRequest,
        @Param("action") action: string,
        @Param("id") id: string
    ): Promise<ServiceActionResponse> {
        this.logger.verbose(
            `[${req.user.name}] GET to /api/services/container/${action}/${id}`
        );

        if (!["start", "stop", "restart"].includes(action)) {
            throw new HttpException("unknown action", HttpStatus.BAD_REQUEST);
        }

        try {
            await this.postToDockerSocket(`/${id}/${action}`);
            return { status: "received" };
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("stack/:action/:id")
    async controlStack(
        @Request() req: AuthenticatedRequest,
        @Param("action") action: string,
        @Param("id") id: string,
        @Query("endpointId") endpointId: string
    ): Promise<ServiceActionResponse> {
        this.logger.verbose(
            `[${req.user.name}] GET to /api/services/stack/${action}/${id}`
        );

        if (!["start", "stop", "restart"].includes(action)) {
            throw new HttpException("unknown action", HttpStatus.BAD_REQUEST);
        }

        try {
            const query = `?endpointId=${endpointId}`;
            if (action === "restart") {
                // Portainer has no restart endpoint; stop then start the stack.
                await this.postToPortainer(`/api/stacks/${id}/stop${query}`);
                await this.postToPortainer(`/api/stacks/${id}/start${query}`);
            } else {
                await this.postToPortainer(
                    `/api/stacks/${id}/${action}${query}`
                );
            }
            return { status: "received" };
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("link/:stack")
    async getLinkConfig(
        @Request() req: AuthenticatedRequest,
        @Param("stack") stack: string
    ): Promise<ServiceLinkConfigResponse> {
        this.logger.verbose(
            `[${req.user.name}] GET to /api/services/link/${stack}`
        );

        try {
            const store = await this.readLinkStore();
            const override = store[stack.toLowerCase()];
            const config: ServiceLinkConfig = override
                ? this.applyOverride(stack, override, { type: "none" })
                : { type: "none" };
            return { status: "received", config };
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                "failed to read link config",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Put("link/:stack")
    async setLinkConfig(
        @Request() req: AuthenticatedRequest,
        @Param("stack") stack: string,
        @Body() body: ServiceLinkConfigUpdate
    ): Promise<ServiceLinkConfigResponse> {
        this.logger.verbose(
            `[${req.user.name}] PUT to /api/services/link/${stack}`
        );

        if (!["none", "port", "fqdn"].includes(body?.type)) {
            throw new HttpException("unknown link type", HttpStatus.BAD_REQUEST);
        }

        if (!this.configPath) {
            throw new HttpException(
                "link config persistence is not configured",
                HttpStatus.NOT_IMPLEMENTED
            );
        }

        try {
            const store = await this.readLinkStore();
            store[stack.toLowerCase()] = {
                type: body.type,
                port: body.port,
                fqdn: body.fqdn,
            };
            await this.writeLinkStore(store);
            const config = this.applyOverride(stack, store[stack.toLowerCase()], {
                type: "none",
            });
            return { status: "received", config };
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                "failed to persist link config",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
