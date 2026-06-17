import { render, screen } from "@testing-library/react";
import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import { FC, ReactNode } from "react";
import { emptyApi } from "../../../Services/emptyApi";
import { MockStoreProvider } from "../../../testHelpers";
import RadioPlayer from "./RadioPlayer";

enableFetchMocks();

const Wrapper: FC<{ children: ReactNode }> = ({ children }) => (
    <MockStoreProvider
        apis={[
            {
                reducerPath: emptyApi.reducerPath,
                reducer: emptyApi.reducer,
                middleware: emptyApi.middleware,
            },
        ]}
    >
        {children}
    </MockStoreProvider>
);

describe("RadioPlayer", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        fetchMock.mockResponse(
            JSON.stringify({
                artist: "Some Artist",
                title: "Some Title",
                name: "Some Programme",
                imageUrl: "http://example.com/image.jpg",
                songImageUrl: "http://example.com/song.jpg",
                last_updated: "0",
            })
        );
    });

    it("shows the default channel and a play control", async () => {
        render(<RadioPlayer />, { wrapper: Wrapper });

        // Default channel from channels.ts
        expect(await screen.findByText("NPO Radio 2")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /play radio/i })
        ).toBeInTheDocument();
    });

    it("displays the now-playing metadata for the selected channel", async () => {
        render(<RadioPlayer />, { wrapper: Wrapper });

        expect(await screen.findByText("Some Title")).toBeInTheDocument();
    });
});
