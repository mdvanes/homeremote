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
    ServiceLogsResponse,
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
import * as YAML from "yaml";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import type { AuthenticatedRequest } from "../login/LoginRequest.types";

// Keyed by lowercase stack name. Each entry is the full, authoritative link
// config for that stack -- persisted as YAML at SERVICES_CONFIG_PATH so it
// survives restarts and can be mounted as a Docker config/bind-mount.
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

// Docker multiplexes non-TTY log streams as frames: an 8-byte header
// (stream type + 4-byte big-endian payload size) followed by the payload.
// Strip the headers so the client receives plain text; fall back to the raw
// string when the buffer is not framed (TTY containers).
const demuxDockerLogs = (buffer: Buffer): string => {
    const parts: string[] = [];
    let offset = 0;
    while (offset + 8 <= buffer.length) {
        const streamType = buffer[offset];
        if (streamType > 2) {
            // Not a valid frame header -> treat the whole buffer as raw text.
            return buffer.toString("utf-8");
        }
        const size = buffer.readUInt32BE(offset + 4);
        const start = offset + 8;
        const end = start + size;
        if (end > buffer.length) {
            return buffer.toString("utf-8");
        }
        parts.push(buffer.toString("utf-8", start, end));
        offset = end;
    }
    return parts.length > 0 ? parts.join("") : buffer.toString("utf-8");
};

@Controller("api/services")
export class ServicesController {
    private readonly logger: Logger;
    private readonly socketPath: string;
    private readonly dockerBaseUrl: string;
    private readonly portainerBaseUrl: string;
    private readonly portainerApiKey: string;
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
        this.configPath =
            this.configService.get<string>("SERVICES_CONFIG_PATH") || "";
    }

    private async readLinkStore(): Promise<LinkStore> {
        if (!this.configPath) {
            return {};
        }
        try {
            const raw = await fs.readFile(this.configPath, "utf-8");
            return (YAML.parse(raw) as LinkStore | null) ?? {};
        } catch (err) {
            // Missing file simply means no links have been saved yet.
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
        await fs.writeFile(this.configPath, YAML.stringify(store), "utf-8");
    }

    // A stored entry is the complete, authoritative link config for a stack
    // -- no merging with auto-discovered values, so an icon-only edit can
    // never silently drop the rest of a previously saved link.
    private buildLink(
        stackName: string,
        entry: ServiceLinkConfigUpdate
    ): ServiceLinkConfig {
        const label = stackName;
        const icon = entry.icon;
        if (entry.type === "port" && entry.port) {
            return {
                type: "port",
                port: entry.port,
                label,
                icon,
                url: this.dockerBaseUrl
                    ? `${this.dockerBaseUrl}:${entry.port}`
                    : undefined,
            };
        }
        if (entry.type === "fqdn" && entry.fqdn) {
            const url = /^https?:\/\//.test(entry.fqdn)
                ? entry.fqdn
                : `https://${entry.fqdn}`;
            return { type: "fqdn", fqdn: entry.fqdn, label, icon, url };
        }
        return { type: "none", label, icon };
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
        const entry = linkStore[stackName.toLowerCase()];
        if (entry) {
            return this.buildLink(stackName, entry);
        }
        return this.discoverLink(stackName, containers);
    }

    // Zero-config fallback for stacks with no stored entry: expose a
    // published Docker port directly.
    private discoverLink(
        stackName: string,
        containers: ServiceContainer[]
    ): ServiceLinkConfig {
        const port = firstPublicPort(containers);
        if (port && this.dockerBaseUrl) {
            return {
                type: "port",
                port,
                url: `${this.dockerBaseUrl}:${port}`,
                label: stackName,
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
            const entry = store[stack.toLowerCase()];
            const config: ServiceLinkConfig = entry
                ? this.buildLink(stack, entry)
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
            throw new HttpException(
                "unknown link type",
                HttpStatus.BAD_REQUEST
            );
        }
        if (body.type === "port" && !body.port) {
            throw new HttpException(
                'port is required for type "port"',
                HttpStatus.BAD_REQUEST
            );
        }
        if (body.type === "fqdn" && !body.fqdn) {
            throw new HttpException(
                'fqdn is required for type "fqdn"',
                HttpStatus.BAD_REQUEST
            );
        }

        if (!this.configPath) {
            throw new HttpException(
                "link config persistence is not configured",
                HttpStatus.NOT_IMPLEMENTED
            );
        }

        try {
            const store = await this.readLinkStore();
            const entry: ServiceLinkConfigUpdate = {
                type: body.type,
                port: body.type === "port" ? body.port : undefined,
                fqdn: body.type === "fqdn" ? body.fqdn : undefined,
                icon: body.icon,
            };
            store[stack.toLowerCase()] = entry;
            await this.writeLinkStore(store);
            const config = this.buildLink(stack, entry);
            return { status: "received", config };
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                "failed to persist link config",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("logs/:id")
    async getContainerLogs(
        @Request() req: AuthenticatedRequest,
        @Param("id") id: string
    ): Promise<ServiceLogsResponse> {
        this.logger.verbose(
            `[${req.user.name}] GET to /api/services/logs/${id}`
        );

        try {
            const buffer = await got(
                buildDockerUrl(
                    this.socketPath,
                    `/${id}/logs?stdout=true&stderr=true&tail=500`
                ),
                { enableUnixSockets: true }
            ).buffer();
            return {
                status: "received",
                logs: demuxDockerLogs(Buffer.from(buffer)),
            };
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                "failed to read container logs",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
