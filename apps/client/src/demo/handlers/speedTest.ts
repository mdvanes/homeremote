import { http, HttpResponse } from "msw";
import { GetSpeedtestResponse } from "../../Services/generated/speedTestApiWithRetry";
import { hexId, isoNow, randFloat, randInt, round } from "../data/random";

export const speedTestHandlers = [
    http.get("*/api/speedtest/latest", () => {
        const response: GetSpeedtestResponse = {
            message: "ok",
            data: {
                id: hexId(8),
                download: round(randFloat(400, 900)),
                upload: round(randFloat(200, 600)),
                ping: round(randFloat(3, 18)),
                server_id: randInt(1000, 9999),
                server_host: "speedtest.demo.example:8080",
                server_name: "Demo ISP - Amsterdam",
                url: "https://speedtest.demo.example",
                scheduled: true,
                failed: false,
                created_at: isoNow(-randInt(1, 30) * 60_000),
                updated_at: isoNow(),
            },
        };
        return HttpResponse.json(response);
    }),
];
