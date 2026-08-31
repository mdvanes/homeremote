import { StreamableFile } from "@nestjs/common";
import type { Request as GotRequest } from "got";

const FALLBACK_TYPE = "application/octet-stream";

/**
 * Wraps a `got` stream in a StreamableFile that carries the upstream
 * Content-Type.
 *
 * Without this Nest falls back to `application/octet-stream`, which only
 * happens to render in an `<img>` because nothing in this app sets
 * `X-Content-Type-Options: nosniff`. Sending the real type also keeps the
 * responses predictable once the service worker serves them from the Cache
 * Storage instead of the network.
 */
export const toProxiedFile = async (
    stream: GotRequest
): Promise<StreamableFile> => {
    const type = await new Promise<string>((resolve, reject) => {
        const onError = (err: Error) => reject(err);

        stream.once("response", (response) => {
            // Leave error handling to the stream consumer from here on, so an
            // upstream failure mid-body behaves exactly as it did before.
            stream.off("error", onError);
            resolve(response.headers["content-type"] ?? FALLBACK_TYPE);
        });
        stream.once("error", onError);
    });

    return new StreamableFile(stream, { type });
};
