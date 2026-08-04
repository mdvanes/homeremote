import { GetScheduleResponse } from "@homeremote/types";
import { http, HttpResponse } from "msw";

const toDateString = (date: Date): string => date.toISOString().slice(0, 10);

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const inThreeDays = new Date(today);
inThreeDays.setDate(inThreeDays.getDate() + 3);

const response: GetScheduleResponse = {
    items: [
        {
            id: "tvshow-1",
            kind: "tvshow",
            date: toDateString(yesterday),
            title: "Some Show",
            posterUrl: null,
            monitored: true,
            hasFile: true,
            seasonNumber: 3,
            episodeNumber: 1,
            episodeTitle: "Some Episode",
        },
        {
            id: "movie-1",
            kind: "movie",
            date: toDateString(today),
            title: "Some Movie",
            posterUrl: null,
            monitored: true,
            hasFile: false,
        },
        {
            id: "tvshow-2",
            kind: "tvshow",
            date: toDateString(inThreeDays),
            title: "Another Show",
            posterUrl: null,
            monitored: false,
            hasFile: false,
            seasonNumber: 1,
            episodeNumber: 5,
            episodeTitle: "Another Episode",
        },
    ],
};

export const scheduleHandlers = [
    http.get("*/api/schedule", () => HttpResponse.json(response)),
];
