import * as Internal from "./generated/caddyInfo";

export type GetCaddyInfoResponse =
    Internal.operations["getCaddyInfo"]["responses"]["200"]["content"]["application/json"];

export type CaddyServerInfo = Internal.components["schemas"]["CaddyServerInfo"];

export type CaddyRouteInfo = Internal.components["schemas"]["CaddyRouteInfo"];
