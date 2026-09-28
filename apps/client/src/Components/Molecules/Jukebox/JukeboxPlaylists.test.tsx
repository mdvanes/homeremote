import { PlaylistResponse, PlaylistsResponse } from "@homeremote/types";
import { fireEvent, render, screen } from "@testing-library/react";
import { FC, ReactNode } from "react";
import {
    MemoryRouter,
    Route,
    Routes,
    useNavigate,
    useParams,
} from "react-router";
import { buildMusicPlaylistPath, ROUTES } from "../../../routes";
import { emptyApi } from "../../../Services/emptyApi";
import { jukeboxApi } from "../../../Services/jukeboxApi";
import fetchMock, { enableFetchMocks } from "../../../test/mswFetchMock";
import { MockStoreProvider } from "../../../testHelpers";
import HotKeyProvider from "../../Providers/HotKey/HotKeyProvider";
import JukeboxPlaybackProvider from "../../Providers/Jukebox/JukeboxPlaybackProvider";
import { LAST_PLAYLIST, LAST_SONG } from "./JukeboxPlayer";
import JukeboxPlaylistDetail from "./JukeboxPlaylistDetail";
import JukeboxPlaylists from "./JukeboxPlaylists";

enableFetchMocks();

const PLAYLIST_NAME = "Rock & Roll/Live";

const Wrapper: FC<{ children: ReactNode }> = ({ children }) => (
    <MockStoreProvider
        apis={[
            {
                reducerPath: emptyApi.reducerPath,
                reducer: emptyApi.reducer,
                middleware: emptyApi.middleware,
            },
            jukeboxApi,
        ]}
    >
        <HotKeyProvider>
            <JukeboxPlaybackProvider>{children}</JukeboxPlaybackProvider>
        </HotKeyProvider>
    </MockStoreProvider>
);

const ListRoute: FC = () => {
    const navigate = useNavigate();
    return (
        <JukeboxPlaylists
            onSelectPlaylist={(name) => navigate(buildMusicPlaylistPath(name))}
        />
    );
};

const DetailRoute: FC = () => {
    const navigate = useNavigate();
    const { playlistName } = useParams<{ playlistName: string }>();
    return (
        <JukeboxPlaylistDetail
            playlistName={playlistName ?? ""}
            onBack={() => navigate(ROUTES.musicPlaylists)}
        />
    );
};

const renderAt = (url: string) =>
    render(
        <MemoryRouter initialEntries={[url]}>
            <Routes>
                <Route path={ROUTES.musicPlaylists} element={<ListRoute />} />
                <Route path={ROUTES.musicPlaylist} element={<DetailRoute />} />
            </Routes>
        </MemoryRouter>,
        { wrapper: Wrapper }
    );

describe("JukeboxPlaylists", () => {
    beforeEach(() => {
        localStorage.clear();
        fetchMock.resetMocks();

        fetchMock.mockResponse((req) => {
            if (req.url.endsWith("/playlists")) {
                return Promise.resolve(
                    JSON.stringify({
                        status: "received",
                        playlists: [
                            {
                                id: "pl1",
                                name: PLAYLIST_NAME,
                                type: "playlist",
                            },
                            {
                                id: "album1",
                                name: "Starred Album",
                                type: "album",
                            },
                        ],
                    } as PlaylistsResponse)
                );
            }
            if (req.url.includes("/playlist/pl1?type=playlist")) {
                return Promise.resolve(
                    JSON.stringify({
                        status: "received",
                        songs: [
                            {
                                id: "song1",
                                artist: "SomeArtist",
                                title: "SomeSong",
                                duration: 125,
                            },
                        ],
                    } as PlaylistResponse)
                );
            }
            return Promise.resolve(JSON.stringify({ status: "error" }));
        });
    });

    it("lists only playlists, opens one by name and plays a song", async () => {
        renderAt(ROUTES.musicPlaylists);

        const playlistItem = await screen.findByText(PLAYLIST_NAME);
        expect(screen.queryByText("Starred Album")).not.toBeInTheDocument();
        fireEvent.click(playlistItem);

        await screen.findByText(PLAYLIST_NAME, { selector: "h6" });
        const song = await screen.findByText("SomeArtist – SomeSong");
        await screen.findByText("2:05");
        fireEvent.click(song);

        expect(JSON.parse(localStorage.getItem(LAST_PLAYLIST) ?? "")).toEqual({
            id: "pl1",
            name: PLAYLIST_NAME,
            type: "playlist",
        });
        expect(JSON.parse(localStorage.getItem(LAST_SONG) ?? "").id).toBe(
            "song1"
        );

        fireEvent.click(screen.getByText("Playlists"));
        await screen.findByText(PLAYLIST_NAME);
        expect(
            screen.queryByText("SomeArtist – SomeSong")
        ).not.toBeInTheDocument();
    });

    it("resolves a playlist from a pasted URL", async () => {
        renderAt(buildMusicPlaylistPath(PLAYLIST_NAME));

        await screen.findByText("SomeArtist – SomeSong");
    });

    it("shows not found for an unknown playlist name", async () => {
        renderAt(buildMusicPlaylistPath("Starred Album"));

        await screen.findByText("That playlist could not be found.");
    });
});
