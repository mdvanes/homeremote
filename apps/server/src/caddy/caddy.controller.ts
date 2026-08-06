import {
    CaddyConfig,
    CaddyHandler,
    CaddyRoute,
    CaddyRouteInfo,
    CaddyServer,
    CaddyServerInfo,
    GetCaddyInfoResponse,
} from "@homeremote/types";
import { Controller, Get, Logger, Request, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import got from "got";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import type { AuthenticatedRequest } from "../login/LoginRequest.types";

// Caddyfile-derived configs nest each site's handlers inside a "subroute"
// handler, whose own routes can in turn contain more handlers - so upstreams
// have to be collected by walking that tree rather than reading one level.
const collectUpstreams = (handlers: CaddyHandler[] = []): string[] => {
    const upstreams: string[] = [];
    for (const handler of handlers) {
        if (handler.handler === "reverse_proxy") {
            for (const upstream of handler.upstreams ?? []) {
                if (upstream.dial) {
                    upstreams.push(upstream.dial);
                }
            }
        }
        for (const nestedRoute of handler.routes ?? []) {
            upstreams.push(...collectUpstreams(nestedRoute.handle));
        }
    }
    return upstreams;
};

const extractRoutes = (server: CaddyServer): CaddyRouteInfo[] =>
    (server.routes ?? [])
        .map((route: CaddyRoute) => {
            const domains = [
                ...new Set(
                    (route.match ?? []).flatMap((match) => match.host ?? [])
                ),
            ].sort();
            const upstreams = [
                ...new Set(collectUpstreams(route.handle)),
            ].sort();
            return { domains, upstreams };
        })
        .filter((route) => route.domains.length > 0);

@Controller("api/caddy")
export class CaddyController {
    private readonly logger: Logger;
    private readonly baseUrl: string;

    constructor(private configService: ConfigService) {
        this.logger = new Logger(CaddyController.name);
        this.baseUrl = this.configService.get<string>("CADDY_BASE_URL") || "";
    }

    private async fetchConfig(): Promise<CaddyConfig | undefined> {
        if (!this.baseUrl) {
            return undefined;
        }
        try {
            return await got(`${this.baseUrl}/config/`).json<CaddyConfig>();
        } catch (err) {
            this.logger.error(`Failed to read Caddy config: ${err}`);
            return undefined;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getCaddyInfo(
        @Request() req: AuthenticatedRequest
    ): Promise<GetCaddyInfoResponse> {
        this.logger.verbose(`[${req.user.name}] GET to /api/caddy`);

        const config = await this.fetchConfig();
        if (!config) {
            return { reachable: false };
        }

        const servers: CaddyServerInfo[] = Object.entries(
            config.apps?.http?.servers ?? {}
        ).map(([name, server]) => ({
            name,
            listen: server.listen ?? [],
            routes: extractRoutes(server),
        }));

        return {
            reachable: true,
            serverCount: servers.length,
            servers,
            tlsAutomationEnabled: Boolean(config.apps?.tls),
        };
    }
}
