import { TrackerItem } from "@homeremote/types";
import { http, HttpResponse } from "msw";
import { randFloat, round, seeded } from "../data/random";

// Anonymous routes around a generic city centre (no real addresses).
const makeTrack = (
    name: string,
    startLat: number,
    startLng: number,
    points: number,
    seed: number
): TrackerItem[] => {
    const rand = seeded(seed);
    let lat = startLat;
    let lng = startLng;
    return Array.from({ length: points }, (_, i) => {
        lat += randFloat(-0.004, 0.004, rand);
        lng += randFloat(-0.006, 0.006, rand);
        return {
            loc: [round(lat, 5), round(lng, 5)] as [number, number],
            time: new Date(Date.now() - (points - i) * 1_800_000).toISOString(),
            name,
            batteryLevel: Math.max(5, 100 - i * 2),
        };
    });
};

export const dataloraHandlers = [
    http.get("*/api/datalora", ({ request }) => {
        const type = new URL(request.url).searchParams.get("type") ?? "24h";
        const points = type === "all" ? 48 : 16;
        const data: TrackerItem[][] = [
            makeTrack("Tracker A", 52.372, 4.9, points, 1),
            makeTrack("Tracker B", 52.365, 4.91, points, 2),
        ];
        return HttpResponse.json({ data });
    }),
];
