import { Workbox } from "workbox-window";

/**
 * Registers the PWA service worker built by InjectManifest (see
 * apps/client/webpack.config.cjs) and drives its update lifecycle.
 *
 * Replaces the create-react-app boilerplate this app was scaffolded with,
 * which hand-rolled the same lifecycle handling and carried dead PUBLIC_URL
 * checks that never applied here.
 */

export const SERVICE_WORKER_URL = "/service-worker.js";

export interface ServiceWorkerConfig {
    onSuccess?: (message: string) => void;
    onUpdate?: (message: string) => void;
}

const isPwaWorker = (worker: ServiceWorker | null): boolean =>
    worker !== null &&
    new URL(worker.scriptURL).pathname === SERVICE_WORKER_URL;

export const register = (config?: ServiceWorkerConfig): void => {
    if (
        process.env.NODE_ENV !== "production" ||
        !("serviceWorker" in navigator)
    ) {
        return;
    }

    const workbox = new Workbox(SERVICE_WORKER_URL);

    // The service worker calls clientsClaim(), so "controlling" also fires on
    // the very first visit. Only reload when we deliberately activated an
    // update, otherwise every first load would reload itself.
    let isApplyingUpdate = false;

    workbox.addEventListener("installed", (event) => {
        if (!event.isUpdate) {
            config?.onSuccess?.("Content is cached for offline use.");
        }
    });

    workbox.addEventListener("waiting", () => {
        isApplyingUpdate = true;
        config?.onUpdate?.("A new version is available, reloading...");
        void workbox.messageSkipWaiting();
    });

    workbox.addEventListener("controlling", () => {
        if (isApplyingUpdate) {
            window.location.reload();
        }
    });

    void workbox.register().catch((error) => {
        console.error("Error during service worker registration:", error);
    });
};

/**
 * Removes the PWA service worker, leaving any other worker on this scope
 * alone - demo mode's Mock Service Worker also claims "/".
 *
 * @returns whether the PWA worker was controlling this page, in which case the
 *          caller has to reload before another worker can take over.
 */
export const unregister = async (): Promise<boolean> => {
    if (!("serviceWorker" in navigator)) {
        return false;
    }

    const registrations = await navigator.serviceWorker.getRegistrations();
    const pwaRegistrations = registrations.filter((registration) =>
        [
            registration.installing,
            registration.waiting,
            registration.active,
        ].some(isPwaWorker)
    );

    if (pwaRegistrations.length === 0) {
        return false;
    }

    const wasControlling = isPwaWorker(navigator.serviceWorker.controller);
    await Promise.all(
        pwaRegistrations.map((registration) => registration.unregister())
    );

    return wasControlling;
};
