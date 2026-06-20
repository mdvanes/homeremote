import { http, HttpResponse } from "msw";
import { svgMarkup, TRANSPARENT_PNG } from "../data/placeholder";

const svgResponse = (label: string, size = 300): Response =>
    new HttpResponse(svgMarkup(label, size, size), {
        headers: { "Content-Type": "image/svg+xml" },
    });

/**
 * Stubs for non-JSON media so images render (as generated placeholders) and
 * audio/video endpoints resolve quietly instead of erroring in the console.
 */
export const mediaHandlers = [
    http.get("*/api/jukebox/coverart/:id", ({ params }) =>
        svgResponse(`Album ${params.id}`)
    ),
    http.get(
        "*/api/jukebox/song/:id",
        () =>
            new HttpResponse(TRANSPARENT_PNG.buffer as ArrayBuffer, {
                headers: { "Content-Type": "audio/mpeg" },
            })
    ),
    http.get("*/api/nextup/thumbnail/:id", () => svgResponse("Next Up")),
    http.get(
        "*/api/nextup/video/:id",
        () => new HttpResponse(null, { status: 204 })
    ),
    http.get("*/api/schedule/thumbnail/:id", () => svgResponse("TV")),
    http.get("*/api/video-stream/hash", () =>
        HttpResponse.json({ hash: "demo" })
    ),
    http.get(
        "*/api/video-stream",
        () => new HttpResponse(null, { status: 204 })
    ),
];
