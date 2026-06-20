import { StackItem } from "@homeremote/types";
import { http, HttpResponse } from "msw";

// Portainer convention: Status 1 = running, 2 = stopped.
const stacks: StackItem[] = [
    { Id: 1, Name: "homeremote", Status: 1, EndpointId: 1 },
    { Id: 2, Name: "monitoring", Status: 1, EndpointId: 1 },
    { Id: 3, Name: "media", Status: 2, EndpointId: 1 },
    { Id: 4, Name: "network", Status: 1, EndpointId: 1 },
];

const setStatus = (id: string, status: number) => {
    const item = stacks.find((s) => `${s.Id}` === id);
    if (item) {
        item.Status = status;
    }
};

export const stacksHandlers = [
    http.get("*/api/stacks", () => HttpResponse.json(stacks)),
    http.get("*/api/stacks/start/:id", ({ params }) => {
        setStatus(String(params.id), 1);
        return HttpResponse.json(stacks);
    }),
    http.get("*/api/stacks/stop/:id", ({ params }) => {
        setStatus(String(params.id), 2);
        return HttpResponse.json(stacks);
    }),
];
