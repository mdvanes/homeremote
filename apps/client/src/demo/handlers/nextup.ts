import { GetNextUpResponse, ShowNextUpItem } from "@homeremote/types";
import { http, HttpResponse } from "msw";
import { hexId } from "../data/random";

const show = (
    seriesName: string,
    name: string,
    season: number,
    episode: number,
    year: number,
    rating: number
): ShowNextUpItem => ({
    Id: hexId(16),
    SeriesName: seriesName,
    ParentIndexNumber: season,
    IndexNumber: episode,
    Name: name,
    ProductionYear: year,
    CommunityRating: rating,
    ImageTags: { Primary: hexId(20) },
});

const response: GetNextUpResponse = {
    items: [
        show("The Demo Chronicles", "A New Dawn", 2, 5, 2023, 8.4),
        show("Mystery Manor", "The Hidden Room", 1, 8, 2024, 7.9),
        show("Galaxy Runners", "Event Horizon", 4, 2, 2022, 8.8),
        show("Cooking with Code", "Async Soufflé", 3, 11, 2024, 7.2),
    ],
};

export const nextupHandlers = [
    http.get("*/api/nextup", () => HttpResponse.json(response)),
];
