import { clearMediaArtCache } from "./serviceWorkerCache";

describe("clearMediaArtCache", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("asks the service worker to drop the media art cache", () => {
        const postMessage = vi.fn();
        vi.stubGlobal("navigator", {
            serviceWorker: { controller: { postMessage } },
        });

        clearMediaArtCache();

        expect(postMessage).toHaveBeenCalledWith({
            type: "CLEAR_MEDIA_ART_CACHE",
        });
    });

    it("does nothing when no service worker controls the page", () => {
        vi.stubGlobal("navigator", { serviceWorker: { controller: null } });

        expect(() => clearMediaArtCache()).not.toThrow();
    });

    it("does nothing when service workers are unsupported", () => {
        vi.stubGlobal("navigator", {});

        expect(() => clearMediaArtCache()).not.toThrow();
    });
});
