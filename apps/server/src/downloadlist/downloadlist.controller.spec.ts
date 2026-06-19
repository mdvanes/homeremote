import { NormalizedTorrent, TorrentState } from "@ctrl/shared-torrent";
import { Transmission } from "@ctrl/transmission";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { DownloadlistController } from "./downloadlist.controller";

const mockResponse: Partial<NormalizedTorrent>[] = [
    {
        id: 1,
        name: "some_name",
        state: TorrentState.paused,
        totalSize: 100000,
        progress: 0.5,
        downloadSpeed: 100,
        uploadSpeed: 100,
        eta: 1234567,
    },
    {
        id: 2,
        name: "some_other_name",
        state: TorrentState.downloading,
        totalSize: 100000,
        progress: 0.1,
        downloadSpeed: 100,
        uploadSpeed: 100,
        eta: 0,
    },
];

const mockResumeTorrent = vi.fn().mockResolvedValue({ result: "mock-ok" });
const mockPauseTorrent = vi.fn().mockResolvedValue({ result: "mock-ok" });
const mockGetAllData = vi.fn().mockResolvedValue({ torrents: mockResponse });

vi.mock("@ctrl/transmission", () => {
    return {
        Transmission: vi.fn().mockImplementation(function () {
            return {
                resumeTorrent: mockResumeTorrent,
                pauseTorrent: mockPauseTorrent,
                getAllData: mockGetAllData,
            };
        }),
    };
});

const MockTransmission = vi.mocked(Transmission); // not to have: Transmission as unknown as vi.Mock<Logger>;

describe("Downloadlist Controller", () => {
    let controller: DownloadlistController;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DownloadlistController],
            providers: [{ provide: ConfigService, useValue: { get: vi.fn() } }],
        }).compile();

        configService = module.get<ConfigService>(ConfigService);
        controller = module.get<DownloadlistController>(DownloadlistController);

        vi.spyOn(configService, "get").mockReturnValueOnce("http://some_url");
        vi.spyOn(configService, "get").mockReturnValueOnce("some_username");
        vi.spyOn(configService, "get").mockReturnValueOnce("some_password");
    });

    describe("getDownloadList GET", () => {
        it("returns a mapped list of current downloads", async () => {
            const result = await controller.getDownloadList();
            expect(MockTransmission).toHaveBeenCalledWith({
                baseUrl: "http://some_url",
                password: "some_password",
                username: "some_username",
            });
            expect(result).toEqual({
                status: "received",
                downloads: [
                    {
                        downloadSpeed: "100 B",
                        eta: "14d",
                        id: 1,
                        name: "some_name",
                        percentage: 50,
                        simpleState: "paused",
                        size: "100 kB",
                        state: "paused",
                        uploadSpeed: "100 B",
                    },
                    {
                        downloadSpeed: "100 B",
                        eta: "",
                        id: 2,
                        name: "some_other_name",
                        percentage: 10,
                        simpleState: "downloading",
                        size: "100 kB",
                        state: "downloading",
                        uploadSpeed: "100 B",
                    },
                ],
            });
        });

        it("maps non-number id to 0", async () => {
            const mockInvalidIdResponse: Partial<NormalizedTorrent>[] = [
                {
                    id: "string_is_possible",
                    name: "some_name",
                    state: TorrentState.paused,
                    totalSize: 100000,
                    progress: 0.5,
                    downloadSpeed: 100,
                    uploadSpeed: 100,
                    eta: 1234567,
                },
            ];
            mockGetAllData.mockResolvedValueOnce({
                torrents: mockInvalidIdResponse,
            });
            const result = await controller.getDownloadList();
            expect(result).toEqual({
                status: "received",
                downloads: [
                    {
                        downloadSpeed: "100 B",
                        eta: "14d",
                        id: 0,
                        name: "some_name",
                        percentage: 50,
                        simpleState: "paused",
                        size: "100 kB",
                        state: "paused",
                        uploadSpeed: "100 B",
                    },
                ],
            });
        });

        it("can return an error on failure", async () => {
            mockGetAllData.mockRejectedValue("mock getAllData failed");

            await expect(controller.getDownloadList()).rejects.toThrow(
                "failed to receive downstream data"
            );

            expect(MockTransmission).toHaveBeenCalledWith({
                baseUrl: "http://some_url",
                password: "some_password",
                username: "some_username",
            });
        });
    });

    describe("pauseDownload GET", () => {
        it("can pause a download", async () => {
            const result = await controller.pauseDownload(14);
            expect(MockTransmission).toHaveBeenCalledWith({
                baseUrl: "http://some_url",
                password: "some_password",
                username: "some_username",
            });
            expect(result).toEqual({ status: "received", message: "mock-ok" });
        });

        it("can return an error on failure", async () => {
            mockPauseTorrent.mockRejectedValue("mock pause failed");

            const result = await controller.pauseDownload(15);
            expect(MockTransmission).toHaveBeenCalledWith({
                baseUrl: "http://some_url",
                password: "some_password",
                username: "some_username",
            });
            expect(result).toEqual({ status: "error" });
        });
    });

    describe("resumeDownload GET", () => {
        it("can resume a download", async () => {
            const result = await controller.resumeDownload(16);
            expect(MockTransmission).toHaveBeenCalledWith({
                baseUrl: "http://some_url",
                password: "some_password",
                username: "some_username",
            });
            expect(result).toEqual({ status: "received", message: "mock-ok" });
        });

        it("can return an error on failure", async () => {
            mockResumeTorrent.mockRejectedValue("mock resume failed");

            const result = await controller.resumeDownload(17);
            expect(MockTransmission).toHaveBeenCalledWith({
                baseUrl: "http://some_url",
                password: "some_password",
                username: "some_username",
            });
            expect(result).toEqual({ status: "error" });
        });
    });
});
