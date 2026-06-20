import { http, HttpResponse } from "msw";

export const urlToMusicHandlers = [
    http.get("*/api/urltomusic/getsearch/:terms", ({ params }) => {
        const terms = decodeURIComponent(String(params.terms));
        return HttpResponse.json({
            searchResults: [
                { title: `${terms} (Official Audio)`, id: "demo-video-1" },
                { title: `${terms} - Live Session`, id: "demo-video-2" },
                { title: `${terms} (Remix)`, id: "demo-video-3" },
            ],
        });
    }),
    http.get("*/api/urltomusic/getinfo/:url", () =>
        HttpResponse.json({
            title: "Demo Track",
            artist: "Demo Artist",
            streamUrl: ["https://demo.example/stream.mp3"],
            versionInfo: "demo 1.0.0",
        })
    ),
    http.get("*/api/urltomusic/getmusic/:url/progress", ({ params }) =>
        HttpResponse.json({
            url: decodeURIComponent(String(params.url)),
            state: "finished",
            path: "/demo/music/demo-track.mp3",
        })
    ),
    http.get("*/api/urltomusic/getmusic/:url", ({ params }) =>
        HttpResponse.json({ url: decodeURIComponent(String(params.url)) })
    ),
];
