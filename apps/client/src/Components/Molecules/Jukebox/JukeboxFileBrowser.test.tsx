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
    return <JukeboxFileBrowser path={path} onNavigate={setPath} />;
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

    it("shows sub-dirs as navigable cards above songs in a mixed dir", async () => {
        fetchMock.mockResponse((req) => {
            if (req.url.includes("/browse/various")) {
                return Promise.resolve(
                    JSON.stringify({
                        status: "received",
                        parentId: "various",
                        items: [
                            { id: "subdir1", title: "SubDir", isDir: true },
                            {
                                id: "song2",
                                title: "LooseSong",
                                isDir: false,
                                artist: "VA",
                                track: 3,
                                duration: 61,
                            },
                        ],
                    } as BrowseResponse)
                );
            }
            if (req.url.includes("/browse/subdir1")) {
                return Promise.resolve(
                    JSON.stringify({
                        status: "received",
                        parentId: "subdir1",
                        items: [
                            {
                                id: "song3",
                                title: "NestedSong",
                                isDir: false,
                                duration: 30,
                            },
                        ],
                    } as BrowseResponse)
                );
            }
            return Promise.resolve(JSON.stringify({ status: "error" }));
        });

        const MixedFileBrowser: FC = () => {
            const [path, setPath] = useState<PathEntry[]>([
                { id: "various", title: "Various" },
            ]);
            return <JukeboxFileBrowser path={path} onNavigate={setPath} />;
        };
        render(<MixedFileBrowser />, { wrapper: Wrapper });

        await screen.findByText("3. LooseSong");
        await screen.findByText("1:01");
        const subDirCard = screen.getByText("SubDir");
        expect(subDirCard.closest("button")).toHaveClass(
            "MuiCardActionArea-root"
        );
        expect(screen.queryByText("0:00")).not.toBeInTheDocument();
        expect(
            subDirCard.compareDocumentPosition(
                screen.getByText("3. LooseSong")
            ) & Node.DOCUMENT_POSITION_FOLLOWING
        ).toBeTruthy();

        fireEvent.click(subDirCard);
        await screen.findByText("NestedSong");
        expect(screen.queryByText("LooseSong")).not.toBeInTheDocument();
    });
});
