import {
    getSongNotificationsEnabled,
    getSongNotificationsWhenStoppedEnabled,
    setSongNotificationsEnabled,
    setSongNotificationsWhenStoppedEnabled,
} from "./songNotificationStorage";

describe("songNotificationStorage", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("defaults to enabled when nothing is stored", () => {
        expect(getSongNotificationsEnabled()).toBe(true);
    });

    it("persists and reads back a disabled preference", () => {
        setSongNotificationsEnabled(false);
        expect(getSongNotificationsEnabled()).toBe(false);
    });

    it("persists and reads back a re-enabled preference", () => {
        setSongNotificationsEnabled(false);
        setSongNotificationsEnabled(true);
        expect(getSongNotificationsEnabled()).toBe(true);
    });

    it("defaults stopped-playback notifications to disabled", () => {
        expect(getSongNotificationsWhenStoppedEnabled()).toBe(false);
    });

    it("persists stopped-playback notifications", () => {
        setSongNotificationsWhenStoppedEnabled(true);
        expect(getSongNotificationsWhenStoppedEnabled()).toBe(true);
    });
});
