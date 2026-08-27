import { PlaylistResponse } from "@homeremote/types";
import { fireEvent, render, screen } from "@testing-library/react";
import { FC, ReactNode } from "react";
import { jukeboxApi } from "../../../Services/jukeboxApi";
import fetchMock, { enableFetchMocks } from "../../../test/mswFetchMock";
import { MockStoreProvider } from "../../../testHelpers";
import JukeboxPlaybackProvider from "../../Providers/Jukebox/JukeboxPlaybackProvider";
import Jukebox from "./Jukebox";
import { LAST_PLAYLIST } from "./JukeboxPlayer";

enableFetchMocks();

const Wrapper: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <MockStoreProvider apis={[jukeboxApi]}>
            <JukeboxPlaybackProvider>{children}</JukeboxPlaybackProvider>
        </MockStoreProvider>
    );
};

describe("Jukebox", () => {
    beforeEach(() => {
        localStorage.clear();
        fetchMock.resetMocks();
    });

    it("shows a 'nothing playing' message when no playlist/album is active", async () => {
        fetchMock.mockResponse(() =>
            Promise.resolve(JSON.stringify({ status: "error" }))
        );
        render(<Jukebox />, { wrapper: Wrapper });

        const browseButton = await screen.findByLabelText(
            "Current playlist songs"
        );
        fireEvent.click(browseButton);

        await screen.findByText("Nothing playing yet");
    });

    it("shows the current playlist/album's name, artist and songs (with duration)", async () => {
        localStorage.setItem(
            LAST_PLAYLIST,
            JSON.stringify({
                id: "1",
                name: "SomeAlbum",
                type: "album",
                artist: "SomeArtist",
            })
        );
        const mockPlaylistResponse: PlaylistResponse = {
            status: "received",
            songs: [
                {
                    id: "s1",
                    artist: "SomeArtist",
                    title: "SomeSong",
                    duration: 125,
                    track: 1,
                },
            ],
        };
        fetchMock.mockResponse((req) => {
            if (req.url.includes("/playlist/1")) {
                return Promise.resolve(JSON.stringify(mockPlaylistResponse));
            }
            return Promise.resolve(JSON.stringify({ status: "error" }));
        });
        render(<Jukebox />, { wrapper: Wrapper });

        const browseButton = await screen.findByLabelText(
            "Current playlist songs"
        );
        fireEvent.click(browseButton);

        await screen.findByText("SomeAlbum");
        await screen.findByText("SomeArtist");
        await screen.findByText("1. SomeSong");
        await screen.findByText("2:05");
    });
});
