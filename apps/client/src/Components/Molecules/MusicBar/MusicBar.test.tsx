import { PlaylistsResponse } from "@homeremote/types";
import { render, screen } from "@testing-library/react";
import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import { FC, ReactNode } from "react";
import { emptyApi } from "../../../Services/emptyApi";
import { jukeboxApi } from "../../../Services/jukeboxApi";
import { MockStoreProvider } from "../../../testHelpers";
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
        {children}
    </MockStoreProvider>
);

describe("MusicBar", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        const playlists: PlaylistsResponse = {
            status: "received",
            playlists: [{ id: "1", name: "SomePlaylist" }],
        };
        fetchMock.mockResponse((req) => {
            if (req.url.includes("/jukebox/")) {
                return Promise.resolve(JSON.stringify(playlists));
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

    it("renders the radio player and the now-playing source image", async () => {
        render(<MusicBar />, { wrapper: Wrapper });

        expect(await screen.findByText("NPO Radio 2")).toBeInTheDocument();
        // The "currently playing source" indicator
        expect(screen.getByText("Radio")).toBeInTheDocument();
    });
});
