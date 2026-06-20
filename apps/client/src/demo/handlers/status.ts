import { http, HttpResponse } from "msw";

export const statusHandlers = [
    http.get("*/api/status", () =>
        HttpResponse.json({ status: "service online" })
    ),
];
