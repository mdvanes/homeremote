import { ServiceLink } from "./servicelinks.types";

export type ServiceHealth = "running" | "degraded" | "stopped";

export interface ServicePort {
    publicPort?: number;
    privatePort?: number;
    type?: string;
    // internal = not published to the host (no reachable public port)
    internal: boolean;
}

export interface ServiceContainer {
    Id: string;
    Name: string;
    Image?: string;
    // raw Docker fields, kept for the detail view
    state: string;
    status: string;
    health: ServiceHealth;
    // unix seconds, used to derive uptime on the client
    createdAt?: number;
    ports: ServicePort[];
    project?: string;
}

export type ServiceLinkType = "none" | "port" | "fqdn";

export interface ServiceLinkConfig {
    type: ServiceLinkType;
    port?: number;
    fqdn?: string;
    label?: string;
    icon?: string;
    // resolved URL to open, undefined when type is "none"
    url?: string;
}

export type ServiceStackSource = "portainer" | "standalone";

export interface ServiceStack {
    // Portainer stack id as string, or "standalone:<name>" for the rest
    Id: string;
    Name: string;
    source: ServiceStackSource;
    endpointId?: number;
    // Portainer status: 1 = running, 2 = stopped (only for source "portainer")
    portainerStatus?: number;
    health: ServiceHealth;
    containers: ServiceContainer[];
    link?: ServiceLinkConfig;
}

export interface ServicesSummary {
    healthy: number;
    degraded: number;
    stopped: number;
}

export interface ServiceActionResponse {
    status: "received" | "error";
}

// Persisted per-stack link override (type + chosen port / FQDN).
export interface ServiceLinkConfigUpdate {
    type: ServiceLinkType;
    port?: number;
    fqdn?: string;
    icon?: string;
}

export type ServiceLinkConfigResponse =
    | { status: "received"; config: ServiceLinkConfig }
    | { status: "error" };

export type ServiceLogsResponse =
    | { status: "received"; logs: string }
    | { status: "error" };

export type ServicesResponse =
    | {
          status: "received";
          stacks: ServiceStack[];
          serviceLinks: ServiceLink[];
          summary: ServicesSummary;
      }
    | { status: "error" };
