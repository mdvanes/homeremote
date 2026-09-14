import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FC, ReactNode } from "react";
import {
    HotKeyContext,
    HotKeyState,
} from "../../Providers/HotKey/HotKeyProvider";
import SongNotificationToggle from "./SongNotificationToggle";

const noop = () => {
    /* */
};

const emptyNowPlayingInfo = {
    title: "",
    artist: "",
    album: "",
    imageUrl: "",
    duration: 0,
};

const baseState: HotKeyState = {
    hotKeyMap: {},
    radioElem: null,
    setRadioElem: noop,
    isRadioPlaying: false,
    setIsRadioPlaying: noop,
    playRadio: noop,
    setPlayRadio: noop,
    radioInfo: emptyNowPlayingInfo,
    setRadioInfo: noop,
    radioChannelId: "radio2",
    setRadioChannelId: noop,
    jukeboxElem: null,
    setJukeboxElem: noop,
    isJukeboxPlaying: false,
    setIsJukeboxPlaying: noop,
    jukeboxInfo: emptyNowPlayingInfo,
    setJukeboxInfo: noop,
    handlePlayPrev: noop,
    setHandlePlayPrev: noop,
    handlePlayNext: noop,
    setHandlePlayNext: noop,
    isPlaying: false,
    togglePlayPause: noop,
    pauseRadio: noop,
    playJukebox: noop,
    handleSkipRadio: noop,
    isSkipRadioActive: false,
    currentSource: "radio",
    songNotificationsEnabled: true,
    setSongNotificationsEnabled: vi.fn(),
    songNotificationsWhenStoppedEnabled: false,
    setSongNotificationsWhenStoppedEnabled: vi.fn(),
};

const Wrapper = (state: Partial<HotKeyState>): FC<{ children: ReactNode }> =>
    function ContextWrapper({ children }) {
        return (
            <HotKeyContext.Provider value={{ ...baseState, ...state }}>
                {children}
            </HotKeyContext.Provider>
        );
    };

describe("SongNotificationToggle", () => {
    const originalNotification = window.Notification;

    afterEach(() => {
        vi.stubGlobal("Notification", originalNotification);
    });

    it("shows the enabled icon and disables notifications on click", async () => {
        vi.stubGlobal("Notification", {
            permission: "granted",
            requestPermission: vi.fn(),
        });
        const setSongNotificationsEnabled = vi.fn();
        render(<SongNotificationToggle />, {
            wrapper: Wrapper({
                songNotificationsEnabled: true,
                setSongNotificationsEnabled,
            }),
        });

        const button = screen.getByLabelText(
            "Toggle song change notifications"
        );
        expect(button).not.toBeDisabled();

        await userEvent.click(button);
        expect(setSongNotificationsEnabled).toHaveBeenCalledWith(false);
    });

    it("requests permission when enabling with default permission", async () => {
        const requestPermission = vi.fn().mockResolvedValue("granted");
        vi.stubGlobal("Notification", {
            permission: "default",
            requestPermission,
        });
        const setSongNotificationsEnabled = vi.fn();
        render(<SongNotificationToggle />, {
            wrapper: Wrapper({
                songNotificationsEnabled: false,
                setSongNotificationsEnabled,
            }),
        });

        await userEvent.click(
            screen.getByLabelText("Toggle song change notifications")
        );

        expect(requestPermission).toHaveBeenCalled();
        expect(setSongNotificationsEnabled).toHaveBeenCalledWith(true);
    });

    it("is disabled and shows the blocked state when permission is denied", () => {
        vi.stubGlobal("Notification", {
            permission: "denied",
            requestPermission: vi.fn(),
        });
        render(<SongNotificationToggle />, {
            wrapper: Wrapper({ songNotificationsEnabled: true }),
        });

        expect(
            screen.getByLabelText("Toggle song change notifications")
        ).toBeDisabled();
    });

    it("enables notifications for metadata changes while music is stopped", async () => {
        vi.stubGlobal("Notification", {
            permission: "granted",
            requestPermission: vi.fn(),
        });
        const setSongNotificationsWhenStoppedEnabled = vi.fn();
        render(<SongNotificationToggle />, {
            wrapper: Wrapper({
                setSongNotificationsWhenStoppedEnabled,
            }),
        });

        await userEvent.click(
            screen.getByLabelText("Song notification options")
        );
        await userEvent.click(
            screen.getByLabelText("Also notify while music is stopped")
        );

        expect(setSongNotificationsWhenStoppedEnabled).toHaveBeenCalledWith(
            true
        );
    });
});
