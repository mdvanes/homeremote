import {
    ChannelName,
    getNowPlaying,
    NowPlayingResponse,
} from "@mdworld/homeremote-stream-player-server";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import got from "got";
import { mocked } from "jest-mock";
import { NowplayingController } from "./nowplaying.controller";

jest.mock("@mdworld/homeremote-stream-player-server");
const mockGetNowPlaying = mocked(getNowPlaying, { shallow: true }); // not to have: getNowPlaying as unknown as jest.Mock<something>;

jest.mock("got");
const mockGot = mocked(got);

describe("Nowplaying Controller", () => {
    let controller: NowplayingController;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [NowplayingController],
            providers: [
                { provide: ConfigService, useValue: { get: jest.fn() } },
            ],
        }).compile();

        configService = module.get<ConfigService>(ConfigService);
        controller = module.get<NowplayingController>(NowplayingController);

        jest.spyOn(configService, "get").mockImplementation((envName) => {
            if (envName === "STEREO8_TOKEN") {
                return undefined;
            }
        });

        mockGetNowPlaying.mockReset();
        mockGetNowPlaying.mockResolvedValue({
            title: "Some Title",
        } as NowPlayingResponse);
    });

    afterAll(() => {
        mockGetNowPlaying.mockRestore();
        mockGot.mockRestore();
    });

    it("returns radio 2 info on /GET", async () => {
        const response = await controller.getRadio2();
        expect(response?.title).toBe("Some Title");
        expect(mockGetNowPlaying).toBeCalledTimes(1);
        expect(mockGetNowPlaying).toBeCalledWith(ChannelName.RADIO2);
    });

    it("throws error on /GET radio 2 info failure", async () => {
        mockGetNowPlaying.mockRejectedValue(new Error("mock server error"));
        await expect(controller.getRadio2()).rejects.toThrow(
            "mock server error"
        );
    });

    // it("throws Stereo 8 Radio 2 info on /GET when no token configured", async () => {
    //     await expect(
    //         controller.getStereo8Radio2({ token: "abc" })
    //     ).rejects.toThrow("Cannot GET /api/nowplaying/stereo8/radio2");
    // });

    // it("throws Stereo 8 Radio 2 info on /GET when invalid token send", async () => {
    //     jest.spyOn(configService, "get").mockImplementation((envName) => {
    //         if (envName === "STEREO8_TOKEN") {
    //             return "abc";
    //         }
    //     });
    //     await expect(
    //         controller.getStereo8Radio2({ token: "123" })
    //     ).rejects.toThrow("Cannot GET /api/nowplaying/stereo8/radio2");
    // });

    // it("returns Stereo 8 Radio 2 info on /GET", async () => {
    //     jest.spyOn(configService, "get").mockImplementation((envName) => {
    //         if (envName === "STEREO8_TOKEN") {
    //             return "abc";
    //         }
    //     });
    //     const response = await controller.getStereo8Radio2({ token: "abc" });
    //     expect(response?.title).toBe("Some Title");
    //     expect(mockGetNowPlaying).toBeCalledTimes(1);
    //     expect(mockGetNowPlaying).toBeCalledWith(ChannelName.RADIO2);
    // });

    it("returns radio 3 info on /GET", async () => {
        const response = await controller.getRadio3();
        expect(response?.title).toBe("Some Title");
        expect(mockGetNowPlaying).toBeCalledTimes(1);
        expect(mockGetNowPlaying).toBeCalledWith(ChannelName.RADIO3);
    });

    it("returns sky info on /GET", async () => {
        const response = await controller.getSky();
        expect(response?.title).toBe("Some Title");
        expect(mockGetNowPlaying).toBeCalledTimes(1);
        expect(mockGetNowPlaying).toBeCalledWith(ChannelName.SKY);
    });

    it("returns pinguin info on /GET", async () => {
        const response = await controller.getPinguin();
        expect(response?.title).toBe("Some Title");
        expect(mockGetNowPlaying).toBeCalledTimes(1);
        expect(mockGetNowPlaying).toBeCalledWith(ChannelName.PINGUIN);
    });
});
