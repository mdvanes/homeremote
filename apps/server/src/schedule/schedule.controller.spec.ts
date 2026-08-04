import {
    MovieApiCalendarResponse,
    TvShowApiCalendarResponse,
} from "@homeremote/types";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import got, { CancelableRequest, Response } from "got";
import type { AuthenticatedRequest } from "../login/LoginRequest.types";
import {
    getScheduleDateRange,
    ScheduleController,
} from "./schedule.controller";

vi.mock("got");
const mockGot = vi.mocked(got);

const mockAuthenticatedRequest = {
    user: { name: "someuser", id: 1 },
} as AuthenticatedRequest;

const mockTvShowResponse: TvShowApiCalendarResponse = [
    {
        id: 1,
        seriesId: 10,
        seasonNumber: 3,
        episodeNumber: 1,
        title: "some missed name",
        airDate: "2022-10-01",
        hasFile: false,
        monitored: true,
        series: {
            title: "Missed",
            titleSlug: "missed",
            images: [
                { coverType: "poster", remoteUrl: "http://poster/tv.jpg" },
            ],
        },
    },
];

const mockMovieResponse: MovieApiCalendarResponse = [
    {
        id: 20,
        title: "Some Movie",
        titleSlug: "some-movie",
        digitalRelease: "2022-11-07",
        hasFile: true,
        monitored: true,
        images: [{ coverType: "poster", remoteUrl: "http://poster/movie.jpg" }],
    },
];

describe("ScheduleController", () => {
    let controller: ScheduleController;

    beforeEach(async () => {
        const mockGet = vi.fn((key: string) => {
            const values: Record<string, string> = {
                TVSHOW_BASE_URL: "http://tvshow-url",
                TVSHOW_API_KEY: "tvshow-key",
                MOVIE_BASE_URL: "http://movie-url",
                MOVIE_API_KEY: "movie-key",
            };
            return values[key];
        });

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ScheduleController],
            providers: [{ provide: ConfigService, useValue: { get: mockGet } }],
        }).compile();
        controller = module.get<ScheduleController>(ScheduleController);
    });

    it("returns a merged, date-sorted schedule on /GET", async () => {
        mockGot.mockImplementation((url) => {
            const response = String(url).includes("tvshow-url")
                ? mockTvShowResponse
                : mockMovieResponse;
            return {
                json: () => Promise.resolve(response),
            } as CancelableRequest<Response>;
        });

        const response = await controller.getSchedule(mockAuthenticatedRequest);

        expect(mockGot).toHaveBeenCalledTimes(2);
        expect(mockGot).toHaveBeenCalledWith(
            "http://tvshow-url/api/v3/calendar",
            expect.objectContaining({
                headers: { "X-Api-Key": "tvshow-key" },
            })
        );
        expect(mockGot).toHaveBeenCalledWith(
            "http://movie-url/api/v3/calendar",
            expect.objectContaining({
                headers: { "X-Api-Key": "movie-key" },
            })
        );
        expect(response).toEqual({
            items: [
                {
                    id: "tvshow-1",
                    kind: "tvshow",
                    date: "2022-10-01",
                    title: "Missed",
                    posterUrl: "/api/schedule/thumbnail/tvshow/10",
                    detailUrl: "http://tvshow-url/series/missed",
                    monitored: true,
                    hasFile: false,
                    seasonNumber: 3,
                    episodeNumber: 1,
                    episodeTitle: "some missed name",
                },
                {
                    id: "movie-20",
                    kind: "movie",
                    date: "2022-11-07",
                    title: "Some Movie",
                    posterUrl: "/api/schedule/thumbnail/movie/20",
                    detailUrl: "http://movie-url/movie/some-movie",
                    monitored: true,
                    hasFile: true,
                },
            ],
        });
    });
});

describe("getScheduleDateRange", () => {
    it("returns 3 days before and 7 days after the given date", () => {
        const now = new Date("2024-05-10T12:00:00Z");
        expect(getScheduleDateRange(now)).toEqual({
            start: "2024-05-07",
            end: "2024-05-17",
        });
    });
});
