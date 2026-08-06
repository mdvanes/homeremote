import { emptyApiWithRetry as api } from "../emptyApiWithRetry";
export const addTagTypes = ["caddy"] as const;
const injectedRtkApi = api
    .enhanceEndpoints({
        addTagTypes,
    })
    .injectEndpoints({
        endpoints: (build) => ({
            getCaddyInfo: build.query<
                GetCaddyInfoApiResponse,
                GetCaddyInfoApiArg
            >({
                query: () => ({ url: `/api/caddy` }),
                providesTags: ["caddy"],
            }),
        }),
        overrideExisting: false,
    });
export { injectedRtkApi as caddyInfoApiWithRetry };
export type GetCaddyInfoApiResponse =
    /** status 200 getCaddyInfo */ GetCaddyInfoResponse;
export type GetCaddyInfoApiArg = void;
export type CaddyRouteInfo = {
    /** Domains this route matches, deduplicated and sorted */
    domains: string[];
    /** Reverse proxy upstream addresses (IP:port) this route forwards to, deduplicated and sorted */
    upstreams: string[];
};
export type CaddyServerInfo = {
    /** Server name as defined in the Caddy config */
    name: string;
    /** Addresses this server listens on */
    listen: string[];
    /** Domain-to-upstream routing for this server */
    routes: CaddyRouteInfo[];
};
export type GetCaddyInfoResponse = {
    /** Whether the Caddy admin API responded */
    reachable: boolean;
    /** Number of configured HTTP servers */
    serverCount?: number;
    servers?: CaddyServerInfo[];
    /** Whether TLS automation is configured */
    tlsAutomationEnabled?: boolean;
};
export type ErrorResponse = {
    /** Human-readable error message */
    message?: string;
};
export const { useGetCaddyInfoQuery } = injectedRtkApi;
