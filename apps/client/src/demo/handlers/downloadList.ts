import { DownloadItem } from "@homeremote/types";
import { http, HttpResponse } from "msw";

const downloads: DownloadItem[] = [
    {
        id: 11,
        name: "ubuntu-24.04-desktop-amd64.iso",
        percentage: 64,
        state: "downloading",
        simpleState: "downloading",
        size: "5.7 GB",
        downloadSpeed: "12.4 MB/s",
        uploadSpeed: "1.1 MB/s",
        eta: "8m",
    },
    {
        id: 14,
        name: "debian-12.5.0-amd64-netinst.iso",
        percentage: 100,
        state: "seeding",
        simpleState: "downloading",
        size: "631 MB",
        downloadSpeed: "0 B/s",
        uploadSpeed: "320 KB/s",
        eta: "∞",
    },
    {
        id: 21,
        name: "fedora-workstation-40.iso",
        percentage: 23,
        state: "paused",
        simpleState: "paused",
        size: "2.1 GB",
        downloadSpeed: "0 B/s",
        uploadSpeed: "0 B/s",
        eta: "∞",
    },
];

const setState = (id: string, simpleState: DownloadItem["simpleState"]) => {
    const item = downloads.find((d) => `${d.id}` === id);
    if (item) {
        item.simpleState = simpleState;
        item.state = simpleState === "paused" ? "paused" : "downloading";
    }
};

export const downloadListHandlers = [
    http.get("*/api/downloadlist", () =>
        HttpResponse.json({ status: "received", downloads })
    ),
    http.get("*/api/downloadlist/pauseDownload/:id", ({ params }) => {
        setState(String(params.id), "paused");
        return HttpResponse.json({ message: "paused", status: "received" });
    }),
    http.get("*/api/downloadlist/resumeDownload/:id", ({ params }) => {
        setState(String(params.id), "downloading");
        return HttpResponse.json({ message: "resumed", status: "received" });
    }),
];
