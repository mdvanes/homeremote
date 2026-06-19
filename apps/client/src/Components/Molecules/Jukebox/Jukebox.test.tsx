import { PlaylistsResponse } from "@homeremote/types";
import { fireEvent, render, screen } from "@testing-library/react";
import { FC, ReactNode } from "react";
import { jukeboxApi } from "../../../Services/jukeboxApi";
import fetchMock, { enableFetchMocks } from "../../../test/mswFetchMock";
import { MockStoreProvider } from "../../../testHelpers";
import Jukebox from "./Jukebox";

enableFetchMocks();

const Wrapper: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <MockStoreProvider apis={[jukeboxApi]}>{children}</MockStoreProvider>
    );
};

describe("Jukebox", () => {
    beforeEach(() => {
        localStorage.clear();
        fetchMock.resetMocks();
    });

    it("shows a browse button that lists the playlists", async () => {
        const mockPlaylistsResponse: PlaylistsResponse = {
            status: "received",
            playlists: [
                {
                    id: "1",
                    name: "SomePlaylist",
                },
            ],
        };
        fetchMock.mockResponse((req) => {
            if (req.url.includes("/songdir")) {
                return Promise.resolve(JSON.stringify({ status: "error" }));
            }
            return Promise.resolve(JSON.stringify(mockPlaylistsResponse));
        });
        render(<Jukebox />, { wrapper: Wrapper });

        const browseButton = await screen.findByLabelText("Browse playlists");
        fireEvent.click(browseButton);

        await screen.findByText("SomePlaylist");
    });
});
