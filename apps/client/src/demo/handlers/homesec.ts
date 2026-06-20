import { HomesecStatusResponse } from "@homeremote/types";
import { http, HttpResponse } from "msw";

const response: HomesecStatusResponse = {
    status: "Disarm",
    devices: [
        {
            id: "1",
            name: "Front Door",
            type_f: "Door Contact",
            status: "Door Close",
            rssi: "Strong, 9",
            cond_ok: "1",
        },
        {
            id: "2",
            name: "Back Door",
            type_f: "Door Contact",
            status: "Door Close",
            rssi: "Strong, 8",
            cond_ok: "1",
        },
        {
            id: "3",
            name: "Hallway Motion",
            type_f: "IR",
            status: "",
            rssi: "Good, 6",
            cond_ok: "1",
        },
        {
            id: "4",
            name: "Kitchen Smoke",
            type_f: "Smoke Detector",
            status: "",
            rssi: "Strong, 9",
            cond_ok: "1",
        },
    ],
};

export const homesecHandlers = [
    http.get("*/api/homesec/status", () => HttpResponse.json(response)),
];
