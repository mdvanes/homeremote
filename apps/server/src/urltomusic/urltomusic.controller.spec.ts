import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import * as youtubedl from "youtube-dl-exec";
import nodeID3 from "node-id3";
import { UrltomusicController } from "./urltomusic.controller";
// import got, { Response, CancelableRequest } from "got";
import * as got from "got";
import { CancelableRequest } from "got";
// import { mocked } from "ts-jest/utils";
import fs from "fs";

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

// const mockFoo = jest.fn();

// jest.mock("node-id3", () => {
//     // const x = jest.requireActual("node-id3");
//     // nodeID3.Promise.write()
//     return {
//         // ...x,
//         // __esModule: true,
//         write: jest.fn().mockImplementation((x, y) => {
//             mockFoo(x, y);
//         }),
//         // write: jest.fn(), // .mockReturnValue(true),
//     };
// });

jest.mock("fs", () => {
    return {
        chmodSync: jest.fn(),
        chownSync: jest.fn(),
    };
});

// const mockGot =
// mocked(got);

const youtubeDlExecSpy = jest.spyOn(youtubedl, "default");

// const id3WriteSpy = jest.fn();

// .mockImplementation((url: string): Promise<youtubedl.YtResponse> => {
//     // callback(undefined, { title: "foo - bar" } as any);
//     return Promise.resolve({
//         title: "foo - bar",
//         formats: [],
//         _version: { version: "123" },
//     } as any);
// });

// const execSpy = jest
//     .spyOn(youtubedl, "exec")
//     .mockImplementation((url, args, options, callback) =>
//         callback(undefined, {} as any)
//     );

const id3WriteSpy = jest
    .spyOn(nodeID3, "write")
    .mockImplementation((path) => `mock file ${path}`);

// const writeSpy = jest.fn().mockImplementation((meta, callback) => {
//     return callback(undefined);
// });

// const writerSpy = jest.spyOn(nodeID3, "write").mockImplementation(() => ({
//     setFile: (/* file */) => {
//         return {
//             write: writeSpy,
//         };
//     },
// }));

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

    afterEach(() => {
        // mockGot.mockReset();
        // getInfoSpy.mockClear();
        // execSpy.mockClear();
        // writerSpy.mockClear();
        // writeSpy.mockClear();
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
        });

        // it("throws error on missing property", async () => {
        //     await expect(
        //         controller.getMusic({
        //             url: "",
        //             artist: "some_artist",
        //             title: "some_title",
        //             album: "some_album",
        //         })
        //     ).rejects.toThrow("url, artist, title, and album are required");
        // });

        // it("throws error when rootPath not configured", async () => {
        //     jest.spyOn(configService, "get").mockReturnValue(undefined);
        //     await expect(
        //         controller.getMusic({
        //             url: "some_url",
        //             artist: "some_artist",
        //             title: "some_title",
        //             album: "some_album",
        //         })
        //     ).rejects.toThrow("rootPath not configured");
        // });

        // it("throws error on remote error", async () => {
        //     execSpy.mockImplementation((url, args, options, callback) =>
        //         callback("URL DOES NOT EXIST", {} as any)
        //     );

        //     await expect(
        //         controller.getMusic({
        //             url: "some_url",
        //             artist: "some_artist",
        //             title: "some_title",
        //             album: "some_album",
        //         })
        //     ).rejects.toThrow("GetMusic failed: some_url URL DOES NOT EXIST");
        // });
    });
});
