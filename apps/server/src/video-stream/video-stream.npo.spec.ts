import got from "got";
import {
    isAllowedUpstreamHost,
    looksLikePlaylist,
    manifestUrlCache,
    resolveManifestUrl,
    rewriteManifest,
} from "./video-stream.npo";

vi.mock("got");
const mockGot = vi.mocked(got);

describe("rewriteManifest", () => {
    const manifestUrl =
        "https://npo-nl-ams-p25-am5.cdn.streamgate.nl/token/live/npo/npo-vsr-2.isml/playlist.m3u8";
    const proxyBase = "/api/video-stream/proxy";

    it("rewrites a relative segment/playlist reference line", () => {
        const result = rewriteManifest(
            "#EXTM3U\nnpo-vsr-2-video=600000.m3u8",
            manifestUrl,
            proxyBase
        );
        expect(result).toContain(
            `${proxyBase}?url=${encodeURIComponent(
                "https://npo-nl-ams-p25-am5.cdn.streamgate.nl/token/live/npo/npo-vsr-2.isml/npo-vsr-2-video=600000.m3u8"
            )}`
        );
    });

    it("rewrites the URI attribute on a tag line (e.g. EXT-X-I-FRAME-STREAM-INF)", () => {
        const result = rewriteManifest(
            '#EXT-X-I-FRAME-STREAM-INF:BANDWIDTH=88000,URI="keyframes/npo-vsr-2.m3u8"',
            manifestUrl,
            proxyBase
        );
        expect(result).toContain(
            `URI="${proxyBase}?url=${encodeURIComponent(
                "https://npo-nl-ams-p25-am5.cdn.streamgate.nl/token/live/npo/npo-vsr-2.isml/keyframes/npo-vsr-2.m3u8"
            )}"`
        );
        expect(result).toContain("BANDWIDTH=88000");
    });

    it("resolves an absolute URI unchanged apart from proxying", () => {
        const result = rewriteManifest(
            "https://other-host.example.com/segment.ts",
            manifestUrl,
            proxyBase
        );
        expect(result).toBe(
            `${proxyBase}?url=${encodeURIComponent(
                "https://other-host.example.com/segment.ts"
            )}`
        );
    });

    it("leaves plain comment lines and blank lines untouched", () => {
        const result = rewriteManifest(
            "#EXTM3U\n\n#EXT-X-VERSION:4",
            manifestUrl,
            proxyBase
        );
        expect(result).toBe("#EXTM3U\n\n#EXT-X-VERSION:4");
    });
});

describe("isAllowedUpstreamHost", () => {
    it("allows an https URL on the NPO CDN suffix", () => {
        expect(
            isAllowedUpstreamHost(
                "https://npo-nl-ams-p25-am5.cdn.streamgate.nl/x.m3u8"
            )
        ).toBe(true);
    });

    it("rejects a different host", () => {
        expect(isAllowedUpstreamHost("https://evil.example.com/x.m3u8")).toBe(
            false
        );
    });

    it("rejects http (non-tls)", () => {
        expect(
            isAllowedUpstreamHost(
                "http://npo-nl-ams-p25-am5.cdn.streamgate.nl/x.m3u8"
            )
        ).toBe(false);
    });

    it("rejects a malformed URL", () => {
        expect(isAllowedUpstreamHost("not-a-url")).toBe(false);
    });
});

describe("looksLikePlaylist", () => {
    it("treats .m3u8 URLs as a playlist", () => {
        expect(looksLikePlaylist("https://host/x.m3u8")).toBe(true);
    });

    it("treats other URLs as binary", () => {
        expect(looksLikePlaylist("https://host/x.ts")).toBe(false);
    });
});

describe("resolveManifestUrl", () => {
    beforeEach(() => {
        manifestUrlCache.url = undefined;
        manifestUrlCache.expiresAt = 0;
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        mockGot.mockReset();
    });

    const mockChain = (streamURL = "https://cdn.streamgate.nl/x.m3u8") => {
        mockGot.mockReturnValueOnce({
            text: () =>
                Promise.resolve(
                    "see https://play-api.nporadio.nl/play/abc.def.ghi for player"
                ),
        } as never);
        mockGot.mockReturnValueOnce({
            json: () =>
                Promise.resolve({
                    environmentDomain: "prod.npoplayer.nl",
                    mid: "LI_RADIO2_300879",
                    playerToken: "player-token",
                }),
        } as never);
        const postSpy = vi.spyOn(got, "post").mockReturnValue({
            json: () =>
                Promise.resolve({
                    stream: { streamURL, drm: null },
                }),
        } as never);
        return postSpy;
    };

    it("resolves the manifest URL through the full chain", async () => {
        const postSpy = mockChain();

        const url = await resolveManifestUrl();

        expect(url).toBe("https://cdn.streamgate.nl/x.m3u8");
        expect(postSpy).toHaveBeenCalledWith(
            "https://prod.npoplayer.nl/stream-link",
            expect.objectContaining({
                headers: { authorization: "player-token" },
            })
        );
    });

    it("caches the resolved URL within the TTL", async () => {
        mockChain();

        await resolveManifestUrl();
        await resolveManifestUrl();

        expect(mockGot).toHaveBeenCalledTimes(2);
    });

    it("re-resolves after the TTL expires", async () => {
        mockChain();
        await resolveManifestUrl();

        vi.advanceTimersByTime(31_000);
        mockChain("https://cdn.streamgate.nl/y.m3u8");
        const url = await resolveManifestUrl();

        expect(url).toBe("https://cdn.streamgate.nl/y.m3u8");
        expect(mockGot).toHaveBeenCalledTimes(4);
    });

    it("throws when no play-api token is found on the live page", async () => {
        mockGot.mockReturnValueOnce({
            text: () => Promise.resolve("no token here"),
        } as never);

        await expect(resolveManifestUrl()).rejects.toThrow(
            "Could not find NPO play-api token"
        );
    });

    it("throws when the stream requires DRM", async () => {
        mockGot.mockReturnValueOnce({
            text: () =>
                Promise.resolve(
                    "https://play-api.nporadio.nl/play/abc.def.ghi"
                ),
        } as never);
        mockGot.mockReturnValueOnce({
            json: () =>
                Promise.resolve({
                    environmentDomain: "prod.npoplayer.nl",
                    mid: "LI_RADIO2_300879",
                    playerToken: "player-token",
                }),
        } as never);
        vi.spyOn(got, "post").mockReturnValue({
            json: () =>
                Promise.resolve({
                    stream: {
                        streamURL: "https://cdn.streamgate.nl/x.m3u8",
                        drm: "widevine",
                    },
                }),
        } as never);

        await expect(resolveManifestUrl()).rejects.toThrow("requires DRM");
    });
});
