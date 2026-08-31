/**
 * The service worker caches media artwork from /api/nextup/thumbnail and
 * /api/schedule/thumbnail, which both sit behind an auth guard. Ask it to drop
 * that cache on logout so images don't outlive the session on a shared device.
 */
export const clearMediaArtCache = (): void => {
    if (!("serviceWorker" in navigator)) {
        return;
    }

    navigator.serviceWorker.controller?.postMessage({
        type: "CLEAR_MEDIA_ART_CACHE",
    });
};
