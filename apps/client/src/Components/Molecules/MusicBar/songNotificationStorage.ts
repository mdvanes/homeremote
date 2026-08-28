export const SONG_NOTIFICATIONS_KEY = "SONG_NOTIFICATIONS_ENABLED";

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
