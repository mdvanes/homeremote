import { render } from "@testing-library/react";
import {
    HotKeyContext,
    HotKeyState,
} from "../../Providers/HotKey/HotKeyProvider";
import SongChangeNotifier from "./SongChangeNotifier";

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
    isPlaying: true,
    togglePlayPause: noop,
    pauseRadio: noop,
    playJukebox: noop,
    handleSkipRadio: noop,
    isSkipRadioActive: false,
    currentSource: "radio",
    songNotificationsEnabled: true,
    setSongNotificationsEnabled: noop,
    songNotificationsWhenStoppedEnabled: false,
    setSongNotificationsWhenStoppedEnabled: noop,
};

const renderWithState = (state: Partial<HotKeyState>) =>
    render(
        <HotKeyContext.Provider value={{ ...baseState, ...state }}>
            <SongChangeNotifier />
        </HotKeyContext.Provider>
    );

describe("SongChangeNotifier", () => {
    let notificationSpy: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        notificationSpy = vi.fn();
        vi.stubGlobal(
            "Notification",
            Object.assign(notificationSpy, { permission: "granted" })
        );
    });

    it("does not notify for the first song observed on a source (baseline)", () => {
        renderWithState({
            radioInfo: {
                ...emptyNowPlayingInfo,
                title: "Song A",
                artist: "Artist A",
            },
        });
        expect(notificationSpy).not.toHaveBeenCalled();
    });

    it("notifies with title, artist and image when the active song changes", () => {
        const { rerender } = renderWithState({
            radioInfo: {
                ...emptyNowPlayingInfo,
                title: "Song A",
                artist: "Artist A",
            },
        });

        rerender(
            <HotKeyContext.Provider
                value={{
                    ...baseState,
                    radioInfo: {
                        ...emptyNowPlayingInfo,
                        title: "Song B",
                        artist: "Artist B",
                        imageUrl: "https://example.com/b.jpg",
                    },
                }}
            >
                <SongChangeNotifier />
            </HotKeyContext.Provider>
        );

        expect(notificationSpy).toHaveBeenCalledWith("Song B", {
            body: "Artist B",
            icon: "https://example.com/b.jpg",
        });
    });

    it("works for the jukebox source too", () => {
        const { rerender } = renderWithState({
            currentSource: "jukebox",
            jukeboxInfo: {
                ...emptyNowPlayingInfo,
                title: "Jukebox A",
                artist: "Artist A",
            },
        });

        rerender(
            <HotKeyContext.Provider
                value={{
                    ...baseState,
                    currentSource: "jukebox",
                    jukeboxInfo: {
                        ...emptyNowPlayingInfo,
                        title: "Jukebox B",
                        artist: "Artist B",
                    },
                }}
            >
                <SongChangeNotifier />
            </HotKeyContext.Provider>
        );

        expect(notificationSpy).toHaveBeenCalledWith("Jukebox B", {
            body: "Artist B",
            icon: undefined,
        });
    });

    it("resolves a relative image URL to an absolute one for the notification icon", () => {
        const { rerender } = renderWithState({
            radioInfo: {
                ...emptyNowPlayingInfo,
                title: "Song A",
                artist: "Artist A",
            },
        });

        rerender(
            <HotKeyContext.Provider
                value={{
                    ...baseState,
                    radioInfo: {
                        ...emptyNowPlayingInfo,
                        title: "Song B",
                        artist: "Artist B",
                        imageUrl: "/api/jukebox/coverart/8329?type=album",
                    },
                }}
            >
                <SongChangeNotifier />
            </HotKeyContext.Provider>
        );

        expect(notificationSpy).toHaveBeenCalledWith("Song B", {
            body: "Artist B",
            icon: `${window.location.origin}/api/jukebox/coverart/8329?type=album`,
        });
    });

    it("does not notify when notifications are disabled", () => {
        const { rerender } = renderWithState({
            songNotificationsEnabled: false,
            radioInfo: {
                ...emptyNowPlayingInfo,
                title: "Song A",
                artist: "Artist A",
            },
        });

        rerender(
            <HotKeyContext.Provider
                value={{
                    ...baseState,
                    songNotificationsEnabled: false,
                    radioInfo: {
                        ...emptyNowPlayingInfo,
                        title: "Song B",
                        artist: "Artist B",
                    },
                }}
            >
                <SongChangeNotifier />
            </HotKeyContext.Provider>
        );

        expect(notificationSpy).not.toHaveBeenCalled();
    });

    it("does not notify while playback is stopped by default", () => {
        const { rerender } = renderWithState({
            isPlaying: false,
            radioInfo: {
                ...emptyNowPlayingInfo,
                title: "Song A",
                artist: "Artist A",
            },
        });

        rerender(
            <HotKeyContext.Provider
                value={{
                    ...baseState,
                    isPlaying: false,
                    radioInfo: {
                        ...emptyNowPlayingInfo,
                        title: "Song B",
                        artist: "Artist B",
                    },
                }}
            >
                <SongChangeNotifier />
            </HotKeyContext.Provider>
        );

        expect(notificationSpy).not.toHaveBeenCalled();
    });

    it("can notify on metadata changes while playback is stopped", () => {
        const { rerender } = renderWithState({
            isPlaying: false,
            songNotificationsWhenStoppedEnabled: true,
            radioInfo: {
                ...emptyNowPlayingInfo,
                title: "Song A",
                artist: "Artist A",
            },
        });

        rerender(
            <HotKeyContext.Provider
                value={{
                    ...baseState,
                    isPlaying: false,
                    songNotificationsWhenStoppedEnabled: true,
                    radioInfo: {
                        ...emptyNowPlayingInfo,
                        title: "Song B",
                        artist: "Artist B",
                    },
                }}
            >
                <SongChangeNotifier />
            </HotKeyContext.Provider>
        );

        expect(notificationSpy).toHaveBeenCalledWith("Song B", {
            body: "Artist B",
            icon: undefined,
        });
    });

    it("does not notify when permission is not granted", () => {
        vi.stubGlobal(
            "Notification",
            Object.assign(vi.fn(), { permission: "default" })
        );
        const { rerender } = renderWithState({
            radioInfo: {
                ...emptyNowPlayingInfo,
                title: "Song A",
                artist: "Artist A",
            },
        });

        rerender(
            <HotKeyContext.Provider
                value={{
                    ...baseState,
                    radioInfo: {
                        ...emptyNowPlayingInfo,
                        title: "Song B",
                        artist: "Artist B",
                    },
                }}
            >
                <SongChangeNotifier />
            </HotKeyContext.Provider>
        );

        expect(notificationSpy).not.toHaveBeenCalled();
    });

    it("does not notify when the song is the same", () => {
        const { rerender } = renderWithState({
            radioInfo: {
                ...emptyNowPlayingInfo,
                title: "Song A",
                artist: "Artist A",
            },
        });

        rerender(
            <HotKeyContext.Provider
                value={{
                    ...baseState,
                    radioInfo: {
                        ...emptyNowPlayingInfo,
                        title: "Song A",
                        artist: "Artist A",
                    },
                }}
            >
                <SongChangeNotifier />
            </HotKeyContext.Provider>
        );

        expect(notificationSpy).not.toHaveBeenCalled();
    });
});
