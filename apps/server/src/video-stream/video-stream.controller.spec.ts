import { StreamableFile } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import got from "got";
import { VideoStreamController } from "./video-stream.controller";
import * as npo from "./video-stream.npo";

vi.mock("got");
const mockGot = vi.mocked(got);

const readStreamableFile = (file: StreamableFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        file.getStream()
            .on("data", (chunk: Buffer) => chunks.push(chunk))
            .on("end", () => resolve(Buffer.concat(chunks).toString()))
            .on("error", reject);
    });

vi.mock("./video-stream.npo", async () => {
    const actual = await vi.importActual<typeof npo>("./video-stream.npo");
    return {
        ...actual,
        resolveManifestUrl: vi.fn(),
        rewriteManifest: vi.fn(),
        isAllowedUpstreamHost: vi.fn(),
        looksLikePlaylist: vi.fn(),
    };
});

describe("VideoStreamController", () => {
    let controller: VideoStreamController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [VideoStreamController],
        }).compile();

        controller = module.get<VideoStreamController>(VideoStreamController);
        vi.clearAllMocks();
    });

    describe("getManifest", () => {
        it("resolves, fetches, and rewrites the manifest", async () => {
            vi.mocked(npo.resolveManifestUrl).mockResolvedValue(
                "https://cdn.streamgate.nl/x.m3u8"
            );
            mockGot.mockReturnValueOnce({
                text: () => Promise.resolve("#EXTM3U\nsegment.ts"),
            } as never);
            vi.mocked(npo.rewriteManifest).mockReturnValue("rewritten");

            const result = await controller.getManifest();

            await expect(readStreamableFile(result)).resolves.toBe("rewritten");
            expect(npo.rewriteManifest).toHaveBeenCalledWith(
                "#EXTM3U\nsegment.ts",
                "https://cdn.streamgate.nl/x.m3u8",
                "/api/video-stream/proxy"
            );
        });

        it("throws when resolution fails", async () => {
            vi.mocked(npo.resolveManifestUrl).mockRejectedValue(
                new Error("boom")
            );

            await expect(controller.getManifest()).rejects.toThrow(
                "failed to resolve video stream manifest"
            );
        });
    });

    describe("getProxiedResource", () => {
        it("rejects a disallowed upstream host", async () => {
            vi.mocked(npo.isAllowedUpstreamHost).mockReturnValue(false);

            await expect(
                controller.getProxiedResource("https://evil.example.com/x")
            ).rejects.toThrow("upstream host not allowed");
        });

        it("rejects a missing url", async () => {
            await expect(controller.getProxiedResource("")).rejects.toThrow(
                "upstream host not allowed"
            );
        });

        it("rewrites and returns playlist content for nested playlists", async () => {
            vi.mocked(npo.isAllowedUpstreamHost).mockReturnValue(true);
            vi.mocked(npo.looksLikePlaylist).mockReturnValue(true);
            mockGot.mockReturnValueOnce({
                text: () => Promise.resolve("#EXTM3U\nsegment.ts"),
            } as never);
            vi.mocked(npo.rewriteManifest).mockReturnValue("rewritten");

            const result = await controller.getProxiedResource(
                "https://cdn.streamgate.nl/variant.m3u8"
            );

            await expect(readStreamableFile(result)).resolves.toBe("rewritten");
        });

        it("streams binary content unchanged", async () => {
            vi.mocked(npo.isAllowedUpstreamHost).mockReturnValue(true);
            vi.mocked(npo.looksLikePlaylist).mockReturnValue(false);
            const fakeStream = {} as never;
            vi.spyOn(got, "stream").mockReturnValue(fakeStream);

            const result = await controller.getProxiedResource(
                "https://cdn.streamgate.nl/segment.ts"
            );

            expect(got.stream).toHaveBeenCalledWith(
                "https://cdn.streamgate.nl/segment.ts"
            );
            expect(result).toBeDefined();
        });
    });
});
