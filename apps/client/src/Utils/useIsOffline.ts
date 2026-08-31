import { useSyncExternalStore } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../Reducers";

const subscribe = (onStoreChange: () => void): (() => void) => {
    window.addEventListener("online", onStoreChange);
    window.addEventListener("offline", onStoreChange);

    return () => {
        window.removeEventListener("online", onStoreChange);
        window.removeEventListener("offline", onStoreChange);
    };
};

const getSnapshot = (): boolean => navigator.onLine;

// There is no server-side render, but useSyncExternalStore still wants a
// snapshot for the initial hydration pass.
const getServerSnapshot = (): boolean => true;

/**
 * Combines the two offline signals.
 *
 * `navigator.onLine` is the fast one: it flips the moment the network
 * interface goes away, without waiting for a request to time out. It is also
 * the optimistic one - it only knows that *a* network exists, not that our
 * server is reachable over it.
 *
 * The service worker's `/api/profile/current` fallback is the slow but
 * authoritative one: a `displayName` of `OFFLINE` means the request actually
 * left and never got an answer.
 */
export const useIsOffline = (): boolean => {
    const isBrowserOnline = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
    );
    const isServerUnreachable = useSelector<RootState, boolean>(
        (state) => state.authentication.isOffline
    );

    return !isBrowserOnline || isServerUnreachable;
};
