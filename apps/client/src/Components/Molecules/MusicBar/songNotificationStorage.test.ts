import {
    getSongNotificationsEnabled,
    setSongNotificationsEnabled,
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
});
