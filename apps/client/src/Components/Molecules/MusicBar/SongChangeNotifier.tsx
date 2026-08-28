import { FC, useEffect, useRef } from "react";
import {
    MusicSource,
    useHotKeyContext,
} from "../../Providers/HotKey/HotKeyProvider";

const isNotificationSupported = (): boolean =>
    typeof window !== "undefined" && "Notification" in window;

const makeSongKey = (title: string, artist: string): string =>
    `${title}|||${artist}`;

// Firefox (and possibly other browsers) silently drops the notification icon
// unless it's a fully-qualified absolute URL - a root-relative path like
// "/api/jukebox/coverart/1" (fine for an <img src>) won't render. Resolve it
// against the page origin so both relative and already-absolute URLs work.
const toAbsoluteUrl = (url: string): string | undefined => {
    if (!url) {
        return undefined;
    }
    try {
        return new URL(url, window.location.origin).toString();
    } catch {
        return undefined;
    }
};

/**
 * Headless component, mounted once in MusicBar, that shows a browser
 * Notification whenever the song for the currently active source (radio or
 * jukebox) changes. The very first song observed for a source is treated as
 * a baseline (no notification) rather than a "change", so simply loading the
 * page (or switching sources) doesn't immediately fire a notification for
 * whatever was already playing.
 */
const SongChangeNotifier: FC = () => {
    const { currentSource, radioInfo, jukeboxInfo, songNotificationsEnabled } =
        useHotKeyContext();
    const lastSeenRef = useRef<Record<MusicSource, string | null>>({
        radio: null,
        jukebox: null,
    });

    const info = currentSource === "radio" ? radioInfo : jukeboxInfo;
    const { title, artist, imageUrl } = info;

    useEffect(() => {
        if (!title) {
            return;
        }

        const key = makeSongKey(title, artist);
        const lastSeen = lastSeenRef.current[currentSource];
        lastSeenRef.current[currentSource] = key;

        // Baseline: first time we see a song for this source, don't notify.
        if (lastSeen === null || lastSeen === key) {
            return;
        }

        if (
            !songNotificationsEnabled ||
            !isNotificationSupported() ||
            Notification.permission !== "granted"
        ) {
            return;
        }

        new Notification(title, {
            body: artist,
            icon: toAbsoluteUrl(imageUrl),
        });
    }, [currentSource, title, artist, imageUrl, songNotificationsEnabled]);

    return null;
};

export default SongChangeNotifier;
