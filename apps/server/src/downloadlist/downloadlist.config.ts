import { Type } from "@nestjs/common";
import { DownloadlistBravoController } from "./downloadlist-bravo.controller";
import { DownloadlistController } from "./downloadlist.controller";

export type DownloadClientVariant = "alpha" | "bravo";

const DEFAULT_VARIANT: DownloadClientVariant = "alpha";

export const getDownloadClientVariant = (): DownloadClientVariant =>
    process.env.DOWNLOAD_CLIENT === "bravo" ? "bravo" : DEFAULT_VARIANT;

/**
 * Thin abstraction layer: exactly one controller is bound to /api/downloadlist,
 * selected at startup via the DOWNLOAD_CLIENT env var. This keeps each backend
 * implementation isolated in its own controller while the front-end keeps
 * talking to a single, stable route.
 */
export const getDownloadlistControllers = (): Type<unknown>[] =>
    getDownloadClientVariant() === "bravo"
        ? [DownloadlistBravoController]
        : [DownloadlistController];
