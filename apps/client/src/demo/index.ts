/**
 * Demo mode entry point.
 *
 * Demo mode replaces every backend `/api/*` and `/auth/*` call with anonymous,
 * type-correct fake data served by a Mock Service Worker running in the browser.
 * It is fully self-contained in this `demo/` folder and is only loaded when the
 * demo flag is set, keeping it cleanly separated from production code.
 *
 * Enable it with any of:
 *   - build env `NX_PUBLIC_DEMO=true` (for a static demo deployment), or
 *   - visiting the app with `?demo` / `?demo=true` (persisted for the session), or
 *   - `localStorage.demo = "true"`.
 * Disable a persisted flag with `?demo=false`.
 */

const STORAGE_KEY = "demo";

const readQueryFlag = (): boolean | undefined => {
    if (typeof window === "undefined") {
        return undefined;
    }
    const params = new URLSearchParams(window.location.search);
    if (!params.has(STORAGE_KEY)) {
        return undefined;
    }
    const value = params.get(STORAGE_KEY);
    return value === null || value === "" || value === "true";
};

export const isDemoMode = (): boolean => {
    if (process.env.NX_PUBLIC_DEMO === "true") {
        return true;
    }

    const queryFlag = readQueryFlag();
    if (queryFlag !== undefined) {
        // Persist so the flag survives client-side navigation and refreshes.
        try {
            if (queryFlag) {
                window.localStorage.setItem(STORAGE_KEY, "true");
            } else {
                window.localStorage.removeItem(STORAGE_KEY);
            }
        } catch {
            // localStorage may be unavailable (private mode); ignore.
        }
        return queryFlag;
    }

    try {
        return window.localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
        return false;
    }
};

/**
 * Starts the demo Mock Service Worker. The heavy worker + handlers are imported
 * dynamically so they are code-split away from the production bundle.
 */
export const startDemo = async (): Promise<void> => {
    const { worker } = await import("./browser");
    await worker.start({
        onUnhandledRequest: "bypass",
        quiet: true,
        serviceWorker: { url: "/mockServiceWorker.js" },
    });
    // eslint-disable-next-line no-console
    console.info(
        "%cHomeRemote demo mode%c — all data is fake and served locally.",
        "font-weight:bold",
        "font-weight:normal"
    );
};
