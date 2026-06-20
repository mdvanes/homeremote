import { ServiceLink, ServiceLinksResponse } from "@homeremote/types";
import { http, HttpResponse } from "msw";

const servicelinks: ServiceLink[] = [
    { url: "#demo-portainer", label: "Portainer", icon: "portainer" },
    { url: "#demo-nextcloud", label: "Nextcloud", icon: "cloud" },
    { url: "#demo-pihole", label: "Pi-hole", icon: "pihole" },
    { url: "#demo-home-assistant", label: "Home Assistant", icon: "home" },
    { url: "#demo-router", label: "Router", icon: "router" },
    { url: "#demo-nas", label: "NAS", icon: "storage" },
    { url: "#demo-grafana", label: "Grafana", icon: "insights" },
];

export const serviceLinksHandlers = [
    http.get("*/api/servicelinks", () =>
        HttpResponse.json<ServiceLinksResponse>({
            status: "received",
            servicelinks,
        })
    ),
];
