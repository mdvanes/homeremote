import {
    NpoPlayToken,
    NpoStreamLinkRequest,
    NpoStreamLinkResponse,
} from "@homeremote/types";
import got from "got";

// NPO's player API is undocumented/reverse-engineered (see docs.npoplayer.nl
// for the little that is officially documented). The chain is:
// 1. The live page embeds a play-api.nporadio.nl/play/<token> URL - scraping
//    this also gives us the current media id, so it never needs hardcoding.
// 2. That play-api call exchanges the token for a short-lived playerToken.
// 3. The playerToken authorizes a stream-link call that returns the actual,
//    signed CDN manifest URL (valid ~24h, no DRM for the hls profile).
export const NPO_LIVE_PAGE_URL = "https://www.nporadio2.nl/live";

const PLAY_TOKEN_URL_PATTERN =
    /https:\/\/play-api\.nporadio\.nl\/play\/[A-Za-z0-9_.-]+/;

const MANIFEST_CACHE_TTL_MS = 30_000;

// Module-level cache so hls.js re-requesting the master manifest doesn't
// re-run the full resolve chain every time. Exported so tests can reset it.
export const manifestUrlCache: { url?: string; expiresAt: number } = {
    url: undefined,
    expiresAt: 0,
};

const fetchManifestUrl = async (): Promise<string> => {
    const html = await got(NPO_LIVE_PAGE_URL).text();
    const match = html.match(PLAY_TOKEN_URL_PATTERN);
    if (!match) {
        throw new Error("Could not find NPO play-api token on the live page");
    }

    const playToken = await got(match[0]).json<NpoPlayToken>();
    if (!playToken.environmentDomain || !playToken.playerToken) {
        throw new Error(
            "NPO play-api response is missing environmentDomain/playerToken"
        );
    }

    const requestBody: NpoStreamLinkRequest = {
        profileName: "hls",
        drmType: "none",
        referrerUrl: NPO_LIVE_PAGE_URL,
    };
    const streamLink = await got
        .post(`https://${playToken.environmentDomain}/stream-link`, {
            headers: { authorization: playToken.playerToken },
            json: requestBody,
        })
        .json<NpoStreamLinkResponse>();

    const stream = streamLink.stream;
    if (!stream?.streamURL) {
        throw new Error("NPO stream-link response is missing streamURL");
    }
    if (stream.drm) {
        throw new Error(
            `NPO stream requires DRM (${stream.drm}), cannot be proxied`
        );
    }

    return stream.streamURL;
};

export const resolveManifestUrl = async (): Promise<string> => {
    const now = Date.now();
    if (manifestUrlCache.url && manifestUrlCache.expiresAt > now) {
        return manifestUrlCache.url;
    }
    const url = await fetchManifestUrl();
    manifestUrlCache.url = url;
    manifestUrlCache.expiresAt = now + MANIFEST_CACHE_TTL_MS;
    return url;
};

// Rewrites every URI in an HLS playlist (plain lines and URI="..." tag
// attributes, e.g. EXT-X-KEY / EXT-X-I-FRAME-STREAM-INF) so the player only
// ever talks to our proxy, never directly to NPO's CDN.
export const rewriteManifest = (
    manifestText: string,
    manifestUrl: string,
    proxyBaseUrl: string
): string => {
    const rewriteUri = (uri: string): string => {
        const absoluteUrl = new URL(uri, manifestUrl).toString();
        return `${proxyBaseUrl}?url=${encodeURIComponent(absoluteUrl)}`;
    };

    return manifestText
        .split("\n")
        .map((line) => {
            const trimmed = line.trim();
            if (trimmed === "") {
                return line;
            }
            if (trimmed.startsWith("#")) {
                return line.replace(
                    /URI="([^"]+)"/,
                    (_match, uri: string) => `URI="${rewriteUri(uri)}"`
                );
            }
            return rewriteUri(trimmed);
        })
        .join("\n");
};

const ALLOWED_UPSTREAM_HOST_SUFFIXES = [".cdn.streamgate.nl"];

export const isAllowedUpstreamHost = (rawUrl: string): boolean => {
    try {
        const { hostname, protocol } = new URL(rawUrl);
        return (
            protocol === "https:" &&
            ALLOWED_UPSTREAM_HOST_SUFFIXES.some((suffix) =>
                hostname.endsWith(suffix)
            )
        );
    } catch {
        return false;
    }
};

export const looksLikePlaylist = (url: string): boolean =>
    url.endsWith(".m3u8");
