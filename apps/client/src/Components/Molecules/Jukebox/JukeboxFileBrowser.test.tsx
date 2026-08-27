import {
    AlbumInfoResponse,
    ArtistInfoResponse,
    BrowseResponse,
} from "@homeremote/types";
import { fireEvent, render, screen } from "@testing-library/react";
import { FC, ReactNode, useState } from "react";
import { emptyApi } from "../../../Services/emptyApi";
import { jukeboxApi } from "../../../Services/jukeboxApi";
import fetchMock, { enableFetchMocks } from "../../../test/mswFetchMock";
import { MockStoreProvider } from "../../../testHelpers";
import HotKeyProvider from "../../Providers/HotKey/HotKeyProvider";
import JukeboxPlaybackProvider from "../../Providers/Jukebox/JukeboxPlaybackProvider";
import JukeboxFileBrowser, { PathEntry } from "./JukeboxFileBrowser";

enableFetchMocks();

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

const StatefulFileBrowser: FC = () => {
    const [path, setPath] = useState<PathEntry[]>([]);
    return <JukeboxFileBrowser path={path} setPath={setPath} />;
};

describe("JukeboxFileBrowser", () => {
    beforeEach(() => {
        localStorage.clear();
        fetchMock.resetMocks();

        fetchMock.mockResponse((req) => {
            if (req.url.endsWith("/browse")) {
                return Promise.resolve(
                    JSON.stringify({
                        status: "received",
                        parentId: null,
                        items: [
                            { id: "artist1", title: "SomeArtist", isDir: true },
                        ],
                    } as BrowseResponse)
                );
            }
            if (req.url.includes("/browse/artist1")) {
                return Promise.resolve(
                    JSON.stringify({
                        status: "received",
                        parentId: "artist1",
                        items: [
                            { id: "album1", title: "SomeAlbum", isDir: true },
                        ],
                    } as BrowseResponse)
                );
            }
            if (req.url.includes("/browse/album1")) {
                return Promise.resolve(
                    JSON.stringify({
                        status: "received",
                        parentId: "album1",
                        items: [
                            {
                                id: "song1",
                                title: "SomeSong",
                                isDir: false,
                                artist: "SomeArtist",
                                track: 1,
                                duration: 125,
                            },
                        ],
                    } as BrowseResponse)
                );
            }
            if (req.url.includes("/albuminfo/album1")) {
                return Promise.resolve(
                    JSON.stringify({
                        status: "received",
                        description: "Some album description",
                    } as AlbumInfoResponse)
                );
            }
            if (req.url.includes("/artistinfo/artist1")) {
                return Promise.resolve(
                    JSON.stringify({
                        status: "received",
                        description: "Some artist biography",
                    } as ArtistInfoResponse)
                );
            }
            return Promise.resolve(JSON.stringify({ status: "error" }));
        });
    });

    it("navigates from artists -> album cards -> song list with sidebar", async () => {
        render(<StatefulFileBrowser />, { wrapper: Wrapper });

        const artistLink = await screen.findByText("SomeArtist");
        fireEvent.click(artistLink);

        const albumCard = await screen.findByText("SomeAlbum");
        await screen.findByText("Some artist biography");
        fireEvent.click(albumCard);

        await screen.findByText("SomeAlbum", { selector: "h6" });
        await screen.findByText("Some album description");
        await screen.findByText("1. SomeSong");
        await screen.findByText("2:05");
    });
});
