import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import fs from "fs";
import * as got from "got";
import { CancelableRequest } from "got";
import nodeID3 from "node-id3";
import * as youtubedl from "youtube-dl-exec";
import { UrltomusicController } from "./urltomusic.controller";

jest.mock("got", () => {
    return {
        __esModule: true,
        default: jest.fn(),
    };
});

jest.mock("youtube-dl-exec", () => {
    return {
        __esModule: true,
        default: jest.fn(),
    };
});

jest.mock("fs", () => {
    return {
        chmodSync: jest.fn(),
        chownSync: jest.fn(),
    };
});

const youtubeDlExecSpy = jest.spyOn(youtubedl, "default");

const id3WriteSpy = jest
    .spyOn(nodeID3, "write")
    .mockImplementation((path) => `mock file ${path}`);

describe("Urltomusic Controller", () => {
    let controller: UrltomusicController;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UrltomusicController],
            providers: [
                { provide: ConfigService, useValue: { get: jest.fn() } },
            ],
        }).compile();

        configService = module.get<ConfigService>(ConfigService);
        controller = module.get<UrltomusicController>(UrltomusicController);

        jest.spyOn(configService, "get").mockImplementation((name) => {
            if (name === "URL_TO_MUSIC_ROOTPATH") {
                return "/some_path";
            }
            if (name === "OWNERINFO_UID" || name === "OWNERINFO_GID") {
                return "1000";
            }
        });

        jest.spyOn(got, "default").mockReturnValue({
            json: () =>
                Promise.resolve([
                    {
                        tag_name: "123",
                    },
                ]),
        } as CancelableRequest<Response>);

        youtubeDlExecSpy.mockReset();
    });

    describe("getInfo POST", () => {
        it("splits title to artist and title", async () => {
            youtubeDlExecSpy.mockResolvedValue({
                title: "foo - bar",
                formats: [],
                // @ts-expect-error _version is incorrectly not in the type
                _version: { version: "123" },
            });

            const result = await controller.getInfo("some_url");
            expect(youtubeDlExecSpy).toBeCalledWith(
                "some_url",
                expect.anything()
            );
            expect(result).toEqual({
                artist: "foo",
                title: "bar",
                streamUrl: [],
                versionInfo: "123",
            });
        });

        it("converts tiny title", async () => {
            youtubeDlExecSpy.mockResolvedValue({
                title: "Foo Bar: Tiny Desk Concert",
                formats: [],
                // @ts-expect-error _version is incorrectly not in the type
                _version: { version: "123" },
            });

            const result = await controller.getInfo("some_url");

            expect(result).toEqual({
                artist: "Foo Bar",
                title: "TODO (Tiny Desk)",
                streamUrl: [],
                versionInfo: "123",
            });
        });

        it("falls back to only artist", async () => {
            youtubeDlExecSpy.mockResolvedValue({
                title: "foo bar",
                formats: [],
                // @ts-expect-error _version is incorrectly not in the type
                _version: { version: "123" },
            });

            const result = await controller.getInfo("some_url");
            expect(result).toEqual({
                artist: "foo bar",
                title: undefined,
                streamUrl: [],
                versionInfo: "123",
            });
        });

        it("throws error on remote error", async () => {
            youtubeDlExecSpy.mockRejectedValue(Error("baz"));
            await expect(controller.getInfo("some_url")).rejects.toThrow(
                "binary outdated or broken, trying to update"
            );
        });
    });

    describe("getMusic POST", () => {
        it("returns a path when complete", async () => {
            const progressBefore = await controller.getMusicProgress(
                "some_url"
            );
            expect(progressBefore).toEqual({
                state: "idle",
                url: "some_url",
            });

            const result = await controller.getMusic(
                "some_url",
                "some_artist",
                "some_title",
                "some_album"
            );
            expect(youtubeDlExecSpy).toBeCalledWith("some_url", {
                addHeader: ["referer:youtube.com", "user-agent:googlebot"],
                audioFormat: "mp3",
                audioQuality: 0,
                extractAudio: true,
                noCheckCertificates: true,
                noWarnings: true,
                output: "/some_path/some_artist - some_title.mp3",
                preferFreeFormats: true,
            });

            // Wait for detached promise to finish
            await new Promise(process.nextTick);

            expect(id3WriteSpy).toBeCalledTimes(1);
            expect(id3WriteSpy).toBeCalledWith(
                {
                    artist: "some_artist",
                    title: "some_title",
                    album: "some_album",
                },
                "/some_path/some_artist - some_title.mp3"
            );
            expect(fs.chmodSync).toBeCalledTimes(1);
            expect(fs.chmodSync).toBeCalledWith(
                "/some_path/some_artist - some_title.mp3",
                "664"
            );
            expect(fs.chownSync).toBeCalledTimes(1);
            expect(fs.chownSync).toBeCalledWith(
                "/some_path/some_artist - some_title.mp3",
                1000,
                1000
            );
            expect(result).toEqual({
                url: "some_url",
            });

            const progressAfter = await controller.getMusicProgress("some_url");
            expect(progressAfter).toEqual({
                path: "/some_path/some_artist - some_title.mp3",
                state: "finished",
                url: "some_url",
            });

            const progressIdle = await controller.getMusicProgress("some_url");
            expect(progressIdle).toEqual({
                state: "idle",
                url: "some_url",
            });
        });

        it("throws error on missing property", async () => {
            await expect(
                controller.getMusic(
                    "",
                    "some_artist",
                    "some_title",
                    "some_album"
                )
            ).rejects.toThrow("url, artist, title, and album are required");
        });

        it("throws error when rootPath not configured", async () => {
            const progressBefore = await controller.getMusicProgress(
                "some_url"
            );
            expect(progressBefore).toEqual({
                state: "idle",
                url: "some_url",
            });

            jest.spyOn(configService, "get").mockReturnValue(undefined);
            const result = await controller.getMusic(
                "some_url",
                "some_artist",
                "some_title",
                "some_album"
            );
            expect(result).toEqual({
                url: "some_url",
            });

            // Wait for detached promise to finish
            await new Promise(process.nextTick);

            await expect(
                controller.getMusicProgress("some_url")
            ).rejects.toThrow("rootPath not configured");

            const progressIdle = await controller.getMusicProgress("some_url");
            expect(progressIdle).toEqual({
                state: "idle",
                url: "some_url",
            });
        });

        it("throws error on remote error", async () => {
            const progressBefore = await controller.getMusicProgress(
                "some_url"
            );
            expect(progressBefore).toEqual({
                state: "idle",
                url: "some_url",
            });

            youtubeDlExecSpy.mockRejectedValue(Error("URL DOES NOT EXIST"));

            const result = await controller.getMusic(
                "some_url",
                "some_artist",
                "some_title",
                "some_album"
            );
            expect(result).toEqual({
                url: "some_url",
            });

            // Wait for detached promise to finish
            await new Promise(process.nextTick);

            await expect(
                controller.getMusicProgress("some_url")
            ).rejects.toThrow("Error URL DOES NOT EXIST");

            const progressIdle = await controller.getMusicProgress("some_url");
            expect(progressIdle).toEqual({
                state: "idle",
                url: "some_url",
            });
        });
    });
});
