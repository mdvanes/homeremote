import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import got from "got";
import { VideoStreamController } from "./video-stream.controller";

jest.mock("got");
const gotHeadSpy = jest.spyOn(got, "head");

describe("VideoStreamController Controller", () => {
    let controller: VideoStreamController;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [VideoStreamController],
            providers: [
                { provide: ConfigService, useValue: { get: jest.fn() } },
            ],
        }).compile();

        configService = module.get<ConfigService>(ConfigService);
        controller = module.get<VideoStreamController>(VideoStreamController);

        jest.spyOn(configService, "get").mockImplementation((envName) => {
            if (envName === "VIDEO_STREAM_HASH") {
                return "abc";
            }
            if (envName === "VIDEO_STREAM_URL") {
                return "http://localhost:123/";
            }
        });
    });

    afterAll(() => {
        gotHeadSpy.mockRestore();
    });

    it("returns video stream hash on /GET", async () => {
        const gotHeadSpy = jest.spyOn(got, "head");
        gotHeadSpy.mockResolvedValue({ statusCode: 200 });

        const response = await controller.getHash();
        expect(response).toEqual({ hash: "abc" });
    });

    // it("returns radio 2 embed fallback on /GET when unrecognized format", async () => {
    //     mockGot.mockReturnValue({
    //         text: () =>
    //             Promise.resolve(
    //                 "prefix='https://start-FOOBAR-player.npo.nl/embed/foo'&suffix"
    //             ),
    //     } as CancelableRequest<Response>);

    //     const response = await controller.getRadio2Embed();
    //     expect(response).toBe("no-reponse");
    // });

    // it("throws error on /GET radio 2 embed failure", async () => {
    //     mockGot.mockReturnValue({
    //         text: () => Promise.reject("mock server error"),
    //     } as CancelableRequest<Response>);
    //     await expect(controller.getRadio2Embed()).rejects.toThrow(
    //         "mock server error"
    //     );
    // });
});
