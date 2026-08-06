import { components } from "./generated/caddy";

export type CaddyConfig = components["schemas"]["Config"];

export type CaddyServer = components["schemas"]["Server"];

export type CaddyRoute = components["schemas"]["Route"];

export type CaddyHandler = components["schemas"]["Handler"];
