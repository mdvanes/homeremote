import { PlaylistsResponse } from "@homeremote/types";
import { render, screen } from "@testing-library/react";
import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import { FC, ReactNode } from "react";
import { jukeboxApi } from "../../../Services/jukeboxApi";
import { MockStoreProvider } from "../../../testHelpers";
import Jukebox from "./Jukebox";

enableFetchMocks();

const Wrapper: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <MockStoreProvider apis={[jukeboxApi]}>{children}</MockStoreProvider>
    );
};

describe("Jukebox", () => {
    it("shows the player", async () => {
        const mockPlaylistsResponse: PlaylistsResponse = {
            status: "received",
            playlists: [
                {
                    id: "1",
                    name: "SomePlaylist",
                },
            ],
        };
        fetchMock.mockResponse(JSON.stringify(mockPlaylistsResponse));
        render(<Jukebox />, { wrapper: Wrapper });

        await screen.findByText("Select a song");
    });
});
