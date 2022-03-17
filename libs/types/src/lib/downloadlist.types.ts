export type SimpleDownloadState = "paused" | "downloading" | "invalid";

export interface DownloadItem {
    id: number;
    name: string;
    percentage: number;
    state: string;
    simpleState: SimpleDownloadState;
    size: string;
    downloadSpeed: string;
    uploadSpeed: string;
    eta: string;
}
