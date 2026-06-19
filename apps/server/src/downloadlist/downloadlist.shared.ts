import { NormalizedTorrent, TorrentState } from "@ctrl/shared-torrent";
import { DownloadItem, SimpleDownloadState } from "@homeremote/types";
import prettyBytes from "pretty-bytes";
import prettyMs from "pretty-ms";

export type DownloadListResponse =
    | { status: "received"; downloads: DownloadItem[] }
    | { status: "error" };

export type DownloadToggleResponse =
    | { status: "received"; message: string }
    | { status: "error" };

export const stateToSimpleState: Record<TorrentState, SimpleDownloadState> = {
    downloading: "downloading",
    seeding: "downloading",
    queued: "downloading",
    checking: "downloading",
    paused: "paused",
    warning: "invalid",
    error: "invalid",
    unknown: "invalid",
};

// The id is supplied by the caller because each backend uses its own id format.
export const mapToDownloadItem = (
    item: NormalizedTorrent,
    id: DownloadItem["id"]
): DownloadItem => ({
    id,
    name: item.name,
    state: item.state,
    simpleState: stateToSimpleState[item.state],
    size: prettyBytes(item.totalSize),
    percentage: Math.floor(item.progress * 100),
    downloadSpeed: prettyBytes(item.downloadSpeed),
    uploadSpeed: prettyBytes(item.uploadSpeed),
    eta: item.eta > 0 ? prettyMs(item.eta * 1000, { compact: true }) : "",
});
