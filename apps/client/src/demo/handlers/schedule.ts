import { GetScheduleResponse } from "@homeremote/types";
import { http, HttpResponse } from "msw";

const response: GetScheduleResponse = {
    data: {
        today: [],
        soon: [],
        later: [],
        missed: [],
        snatched: [],
    },
    message: "",
    result: "success",
};

export const scheduleHandlers = [
    http.get("*/api/schedule", () => HttpResponse.json(response)),
];
