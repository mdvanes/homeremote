import { QBittorrent } from "@ctrl/qbittorrent";
import { NormalizedTorrent, TorrentState } from "@ctrl/shared-torrent";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { DownloadlistBravoController } from "./downloadlist-bravo.controller";

const mockResponse: Partial<NormalizedTorrent>[] = [
    {
        id: "abc123hash",
        name: "some_name",
        state: TorrentState.paused,
        totalSize: 100000,
        progress: 0.5,
        downloadSpeed: 100,
        uploadSpeed: 100,
        eta: 1234567,
    },
    {
        id: "def456hash",
        name: "some_other_name",
        state: TorrentState.downloading,
        totalSize: 100000,
        progress: 0.1,
        downloadSpeed: 100,
        uploadSpeed: 100,
        eta: 0,
    },
];

const mockResumeTorrent = vi.fn().mockResolvedValue(true);
const mockPauseTorrent = vi.fn().mockResolvedValue(true);
const mockGetAllData = vi.fn().mockResolvedValue({ torrents: mockResponse });

vi.mock("@ctrl/qbittorrent", () => {
    return {
        QBittorrent: vi.fn().mockImplementation(function () {
            return {
                resumeTorrent: mockResumeTorrent,
                pauseTorrent: mockPauseTorrent,
                getAllData: mockGetAllData,
            };
        }),
    };
});

const MockQBittorrent = vi.mocked(QBittorrent);

describe("Downloadlist Bravo Controller", () => {
    let controller: DownloadlistBravoController;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DownloadlistBravoController],
            providers: [{ provide: ConfigService, useValue: { get: vi.fn() } }],
        }).compile();

        configService = module.get<ConfigService>(ConfigService);
        controller = module.get<DownloadlistBravoController>(
            DownloadlistBravoController
        );

        vi.spyOn(configService, "get").mockReturnValueOnce("http://some_url");
        vi.spyOn(configService, "get").mockReturnValueOnce("some_username");
        vi.spyOn(configService, "get").mockReturnValueOnce("some_password");
    });

    describe("getDownloadList GET", () => {
        it("returns a mapped list of current downloads, keeping the string id", async () => {
            const result = await controller.getDownloadList();
            expect(MockQBittorrent).toHaveBeenCalledWith({
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
                        id: "abc123hash",
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
                        id: "def456hash",
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

        it("can return an error on failure", async () => {
            mockGetAllData.mockRejectedValue("mock getAllData failed");

            await expect(controller.getDownloadList()).rejects.toThrow(
                "failed to receive downstream data"
            );

            expect(MockQBittorrent).toHaveBeenCalledWith({
                baseUrl: "http://some_url",
                password: "some_password",
                username: "some_username",
            });
        });
    });

    describe("pauseDownload GET", () => {
        it("can pause a download by hash", async () => {
            const result = await controller.pauseDownload("abc123hash");
            expect(mockPauseTorrent).toHaveBeenCalledWith("abc123hash");
            expect(MockQBittorrent).toHaveBeenCalledWith({
                baseUrl: "http://some_url",
                password: "some_password",
                username: "some_username",
            });
            expect(result).toEqual({ status: "received", message: "paused" });
        });

        it("can return an error on failure", async () => {
            mockPauseTorrent.mockRejectedValue("mock pause failed");

            const result = await controller.pauseDownload("def456hash");
            expect(result).toEqual({ status: "error" });
        });
    });

    describe("resumeDownload GET", () => {
        it("can resume a download by hash", async () => {
            const result = await controller.resumeDownload("abc123hash");
            expect(mockResumeTorrent).toHaveBeenCalledWith("abc123hash");
            expect(result).toEqual({ status: "received", message: "resumed" });
        });

        it("can return an error on failure", async () => {
            mockResumeTorrent.mockRejectedValue("mock resume failed");

            const result = await controller.resumeDownload("def456hash");
            expect(result).toEqual({ status: "error" });
        });
    });
});
