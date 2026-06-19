import { PlaylistsResponse } from "@homeremote/types";
import { render, screen } from "@testing-library/react";
import { FC, ReactNode } from "react";
import { emptyApi } from "../../../Services/emptyApi";
import { jukeboxApi } from "../../../Services/jukeboxApi";
import fetchMock, { enableFetchMocks } from "../../../test/mswFetchMock";
import { MockStoreProvider } from "../../../testHelpers";
import HotKeyProvider from "../../Providers/HotKey/HotKeyProvider";
import MusicBar from "./MusicBar";

enableFetchMocks();

const Wrapper: FC<{ children: ReactNode }> = ({ children }) => (
    <MockStoreProvider
        apis={[
            {
                reducerPath: emptyApi.reducerPath,
                reducer: emptyApi.reducer,
                middleware: emptyApi.middleware,
            },
            {
                reducerPath: jukeboxApi.reducerPath,
                reducer: jukeboxApi.reducer,
                middleware: jukeboxApi.middleware,
            },
        ]}
    >
        <HotKeyProvider>{children}</HotKeyProvider>
    </MockStoreProvider>
);

describe("MusicBar", () => {
    beforeEach(() => {
        localStorage.clear();
        fetchMock.resetMocks();
        const playlists: PlaylistsResponse = {
            status: "received",
            playlists: [{ id: "1", name: "SomePlaylist" }],
        };
        fetchMock.mockResponse((req) => {
            if (req.url.includes("/songdir")) {
                return Promise.resolve(JSON.stringify({ status: "error" }));
            }
            if (req.url.includes("/jukebox/")) {
                return Promise.resolve(JSON.stringify(playlists));
            }
            if (req.url.includes("previously")) {
                return Promise.resolve(JSON.stringify([]));
            }
            return Promise.resolve(
                JSON.stringify({
                    artist: "Some Artist",
                    title: "Some Title",
                    name: "Some Programme",
                    imageUrl: "",
                    songImageUrl: "",
                    last_updated: "0",
                })
            );
        });
    });

    it("shows the unified now-playing info and player controls", async () => {
        render(<MusicBar />, { wrapper: Wrapper });

        // The radio metadata flows through the provider into the unified TrackInfo.
        expect(await screen.findByText("Some Title")).toBeInTheDocument();
        expect(screen.getByText("Some Artist")).toBeInTheDocument();

        // Unified transport + compact entry points are present.
        expect(screen.getByLabelText("Play")).toBeInTheDocument();
        expect(
            screen.getByLabelText("Choose radio station")
        ).toBeInTheDocument();
        expect(screen.getByLabelText("Browse playlists")).toBeInTheDocument();
        expect(
            screen.getByLabelText("Previously played on radio")
        ).toBeInTheDocument();
    });
});
