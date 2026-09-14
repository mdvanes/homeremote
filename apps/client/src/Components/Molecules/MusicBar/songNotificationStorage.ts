export const SONG_NOTIFICATIONS_KEY = "SONG_NOTIFICATIONS_ENABLED";
export const SONG_NOTIFICATIONS_WHEN_STOPPED_KEY =
    "SONG_NOTIFICATIONS_WHEN_STOPPED_ENABLED";

/**
 * Whether browser notifications should be shown when the currently playing
 * song changes. Opt-out: enabled by default unless the user explicitly
 * disabled it before.
 */
export const getSongNotificationsEnabled = (): boolean => {
    const stored = localStorage.getItem(SONG_NOTIFICATIONS_KEY);
    return stored !== "false";
};

export const setSongNotificationsEnabled = (enabled: boolean): void => {
    localStorage.setItem(SONG_NOTIFICATIONS_KEY, enabled.toString());
};

/**
 * Whether metadata changes should also trigger notifications while playback
 * is stopped. This is opt-in because radio metadata can keep changing while
 * the user is not listening.
 */
export const getSongNotificationsWhenStoppedEnabled = (): boolean =>
    localStorage.getItem(SONG_NOTIFICATIONS_WHEN_STOPPED_KEY) === "true";

export const setSongNotificationsWhenStoppedEnabled = (
    enabled: boolean
): void => {
    localStorage.setItem(
        SONG_NOTIFICATIONS_WHEN_STOPPED_KEY,
        enabled.toString()
    );
};
