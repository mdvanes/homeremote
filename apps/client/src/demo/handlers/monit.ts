import { GetMonitResponse } from "@homeremote/types";
import { http, HttpResponse } from "msw";

const response: GetMonitResponse = {
    monitlist: [
        {
            localhostname: "homeserver",
            uptime: "12d 4h",
            services: [
                { name: "homeserver", status: 0, status_hint: 0 },
                {
                    name: "rootfs",
                    status: 0,
                    status_hint: 0,
                    block: { percent: 47.2, usage: "94.4 GB", total: "200 GB" },
                },
                {
                    name: "data",
                    status: 0,
                    status_hint: 0,
                    block: { percent: 71.8, usage: "1.4 TB", total: "2 TB" },
                },
                {
                    name: "nginx",
                    status: 0,
                    status_hint: 0,
                    port: { protocol: "HTTP", portnumber: 443 },
                },
                {
                    name: "ssh",
                    status: 0,
                    status_hint: 0,
                    port: { protocol: "SSH", portnumber: 22 },
                },
            ],
        },
        {
            localhostname: "nas",
            uptime: "48d 9h",
            services: [
                { name: "nas", status: 0, status_hint: 0 },
                {
                    name: "backup",
                    status: 0,
                    status_hint: 0,
                    block: { percent: 33.1, usage: "1.3 TB", total: "4 TB" },
                },
            ],
        },
    ],
};

export const monitHandlers = [
    http.get("*/api/monit", () => HttpResponse.json(response)),
];
