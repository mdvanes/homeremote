import { DockerContainerUIInfo } from "@homeremote/types";
import { http, HttpResponse } from "msw";

const container = (
    id: string,
    name: string,
    project: string | null,
    running: boolean
): DockerContainerUIInfo => ({
    Id: id,
    Names: [`/${name}`],
    State: running ? "running" : "exited",
    Status: running ? "Up 3 hours" : "Exited (0) 2 hours ago",
    Labels: { "com.docker.compose.project": project },
});

const containers: DockerContainerUIInfo[] = [
    container("c1a2b3", "homeremote", "homeremote", true),
    container("d4e5f6", "grafana", "monitoring", true),
    container("a7b8c9", "influxdb", "monitoring", true),
    container("e1f2a3", "pihole", "network", true),
    container("b4c5d6", "linkwarden", "media", false),
    container("f7a8b9", "gramps", "media", false),
];

const setState = (id: string, running: boolean) => {
    const item = containers.find((c) => c.Id === id);
    if (item) {
        item.State = running ? "running" : "exited";
        item.Status = running ? "Up 1 second" : "Exited (0) 1 second ago";
    }
};

export const dockerListHandlers = [
    http.get("*/api/dockerlist", () =>
        HttpResponse.json({ status: "received", containers })
    ),
    http.get("*/api/dockerlist/start/:id", ({ params }) => {
        setState(String(params.id), true);
        return HttpResponse.json({ status: "received", containers });
    }),
    http.get("*/api/dockerlist/stop/:id", ({ params }) => {
        setState(String(params.id), false);
        return HttpResponse.json({ status: "received", containers });
    }),
];
