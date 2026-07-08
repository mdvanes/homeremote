import { ServicesResponse, ServiceStack } from "@homeremote/types";
import { http, HttpResponse } from "msw";

const stack = (
    id: string,
    name: string,
    source: ServiceStack["source"],
    containers: {
        name: string;
        health: ServiceStack["containers"][number]["health"];
    }[],
    link?: ServiceStack["link"]
): ServiceStack => {
    const mapped = containers.map((c, index) => ({
        Id: `${id}-${index}`,
        Name: c.name,
        Image: "example/image:latest",
        state: c.health === "stopped" ? "exited" : "running",
        status:
            c.health === "stopped"
                ? "Exited (0) 2 hours ago"
                : c.health === "degraded"
                  ? "Up 3 hours (unhealthy)"
                  : "Up 3 hours",
        health: c.health,
        ports: [],
    }));
    const stopped = mapped.filter((c) => c.health === "stopped").length;
    const degraded = mapped.filter((c) => c.health === "degraded").length;
    const health: ServiceStack["health"] =
        stopped === mapped.length && mapped.length > 0
            ? "stopped"
            : stopped > 0 || degraded > 0
              ? "degraded"
              : "running";
    return {
        Id: id,
        Name: name,
        source,
        endpointId: source === "portainer" ? 1 : undefined,
        portainerStatus: source === "portainer" ? 1 : undefined,
        health,
        containers: mapped,
        link,
    };
};

const stacks: ServiceStack[] = [
    stack(
        "1",
        "monitoring",
        "portainer",
        [
            { name: "grafana", health: "running" },
            { name: "influxdb", health: "running" },
        ],
        {
            type: "port",
            port: 3000,
            url: "http://homeserver:3000",
            label: "monitoring",
        }
    ),
    stack("2", "linkwarden", "portainer", [
        { name: "linkwarden", health: "running" },
        { name: "linkwarden-browser", health: "degraded" },
        { name: "postgres", health: "running" },
    ]),
    stack("3", "media", "portainer", [
        { name: "jellyfin", health: "stopped" },
        { name: "postgres", health: "stopped" },
    ]),
    stack(
        "4",
        "network",
        "portainer",
        [{ name: "pihole", health: "running" }],
        {
            type: "fqdn",
            url: "http://pihole.home.arpa",
            label: "pihole",
            icon: "pihole",
        }
    ),
    stack("standalone:caddy", "caddy", "standalone", [
        { name: "caddy", health: "running" },
    ]),
];

const summary = stacks.reduce(
    (acc, s) => {
        if (s.health === "running") {
            acc.healthy += 1;
        } else if (s.health === "degraded") {
            acc.degraded += 1;
        } else {
            acc.stopped += 1;
        }
        return acc;
    },
    { healthy: 0, degraded: 0, stopped: 0 }
);

const serviceLinks = stacks
    .filter((s) => s.link?.url && s.link.label)
    .map((s) => ({
        label: s.link?.label as string,
        url: s.link?.url as string,
        icon: s.link?.icon ?? "",
    }));

const response: ServicesResponse = {
    status: "received",
    stacks,
    serviceLinks,
    summary,
};

export const servicesHandlers = [
    http.get("*/api/services", () => HttpResponse.json(response)),
    http.get("*/api/services/container/:action/:id", () =>
        HttpResponse.json({ status: "received" })
    ),
    http.get("*/api/services/stack/:action/:id", () =>
        HttpResponse.json({ status: "received" })
    ),
];
