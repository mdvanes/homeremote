/**
 * Asks the browser not to evict our Cache Storage under disk pressure.
 *
 * Without this the precached app shell and the cached artwork are "best
 * effort" storage, which is exactly the bucket a browser clears first - and
 * losing the app shell is what turns "offline" back into a dinosaur page.
 *
 * Only called once signed in: Chrome grants this silently based on engagement,
 * but Firefox shows a permission prompt, and asking an anonymous visitor is
 * rude.
 */
export const requestPersistentStorage = async (): Promise<void> => {
    if (!navigator.storage?.persist) {
        return;
    }

    try {
        if (await navigator.storage.persisted()) {
            return;
        }
        await navigator.storage.persist();
    } catch {
        // Denied or unsupported. Caching still works, it is just evictable.
    }
};
