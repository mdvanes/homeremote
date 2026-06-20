import { http, HttpResponse } from "msw";
import { getSmartEntities, setSwitchState } from "../data/entities";

export const smartEntitiesHandlers = [
    http.get("*/api/smart-entities", () =>
        HttpResponse.json(getSmartEntities())
    ),
    http.post("*/api/smart-entities/:entityId", async ({ params, request }) => {
        const entityId = String(params.entityId);
        const body = (await request.json().catch(() => ({}))) as {
            state?: "on" | "off";
        };
        if (body.state === "on" || body.state === "off") {
            setSwitchState(entityId, body.state);
        }
        return HttpResponse.json({}, { status: 201 });
    }),
];
