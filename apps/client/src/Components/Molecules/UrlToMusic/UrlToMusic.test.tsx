import {
    UrlToMusicGetInfoResponse,
    UrlToMusicGetMusicProgressResponse,
    UrlToMusicGetMusicResponse,
    UrlToMusicGetSearchResponse,
} from "@homeremote/types";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import { FC, ReactNode } from "react";
import { urlToMusicApi } from "../../../Services/generated/urlToMusicApi";
import {
    MockStoreProvider,
    MockStoreProviderApi,
    createGetCalledUrl,
} from "../../../testHelpers";
import loglinesReducer from "../../Molecules/LogCard/logSlice";
import UrlToMusic from "./UrlToMusic";

enableFetchMocks();

const getCalledUrl = (callNr: number) => createGetCalledUrl(fetchMock)(callNr);

const urlToMusicFakeApi: MockStoreProviderApi = {
    reducerPath: urlToMusicApi.reducerPath,
    reducer: urlToMusicApi.reducer,
    middleware: urlToMusicApi.middleware,
};

const loglinesFakeApi: MockStoreProviderApi = {
    reducerPath: "loglines",
    reducer: loglinesReducer,
};

const Wrapper: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <MockStoreProvider apis={[urlToMusicFakeApi, loglinesFakeApi]}>
            {children}
        </MockStoreProvider>
    );
};

describe("UrlToMusic", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    it("opens the dialog from a button", async () => {
        const { asFragment } = render(<UrlToMusic />, { wrapper: Wrapper });

        expect(
            screen.queryByRole("textbox", { name: "URL" })
        ).not.toBeInTheDocument();

        await userEvent.click(
            screen.getByRole("button", { name: /URL to Music/i })
        );

        expect(
            await screen.findByRole("textbox", { name: "URL" })
        ).toBeInTheDocument();
        expect(asFragment()).toMatchSnapshot();
    });

    const openDialogAndSetUrl = async () => {
        const rendered = render(<UrlToMusic />, { wrapper: Wrapper });

        await userEvent.click(
            screen.getByRole("button", { name: /URL to Music/i })
        );

        const urlInput = await screen.findByRole("textbox", { name: "URL" });
        expect(screen.getByRole("textbox", { name: "Title" })).toBeDisabled();

        fireEvent.change(urlInput, { target: { value: "Some URL" } });

        expect(fetchMock).not.toHaveBeenCalled();
        const getInfoButton = screen.getByRole("button", { name: "Get Info" });
        return { urlInput, getInfoButton, rendered };
    };

    const mockGetInfoResponse: UrlToMusicGetInfoResponse = {
        title: "Some Title",
        artist: "Some Artist",
        streamUrl: ["a"],
        versionInfo: "1",
    };

    const mockGetMusicResponse: UrlToMusicGetMusicResponse = { url: "a" };
    const mockGetMusicProgressResponse: UrlToMusicGetMusicProgressResponse = {
        state: "finished",
        url: "a",
        path: "some/result/path.txt",
    };

    it("can submit the getinfo form", async () => {
        const { urlInput, getInfoButton } = await openDialogAndSetUrl();

        fetchMock.mockResponse(JSON.stringify(mockGetInfoResponse));
        userEvent.click(getInfoButton);

        const titleInput = await screen.findByDisplayValue("Some Title");

        expect(urlInput).toHaveValue("Some URL");
        expect(titleInput).toBeEnabled();
        expect(screen.getByRole("textbox", { name: "Artist" })).toHaveValue(
            "Some Artist"
        );
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(getCalledUrl(0)).toBe("/api/urltomusic/getinfo/Some%20URL");
    });

    it("can handle getinfo error", async () => {
        const { getInfoButton } = await openDialogAndSetUrl();

        fetchMock.mockReject(Error("some getinfo error"));
        userEvent.click(getInfoButton);

        await screen.findByText("[FETCH_ERROR] Error: some getinfo error");
        expect(
            screen.getByText("[FETCH_ERROR] Error: some getinfo error")
        ).toBeVisible();
    });

    it("can submit the getmusic form", async () => {
        const { getInfoButton } = await openDialogAndSetUrl();

        fetchMock.mockResponse(JSON.stringify(mockGetInfoResponse));
        userEvent.click(getInfoButton);

        const titleInput = await screen.findByDisplayValue("Some Title");

        fireEvent.change(titleInput, {
            target: { value: "Some Other Title" },
        });

        const getMusicButton = screen.getByRole("button", {
            name: "Get Music",
        });

        fetchMock.mockReset();
        fetchMock.mockResponses(
            JSON.stringify(mockGetMusicResponse),
            JSON.stringify(mockGetMusicProgressResponse)
        );
        userEvent.click(getMusicButton);

        const resultText = await screen.findByText(
            /Result in some\/result\/path\.txt/
        );
        expect(resultText).toBeVisible();

        expect(getCalledUrl(0)).toBe(
            "/api/urltomusic/getmusic/Some%20URL?artist=Some+Artist&title=Some+Other+Title&album=Songs+from+2026"
        );
        expect(getCalledUrl(1)).toBe(
            "/api/urltomusic/getmusic/Some%20URL/progress"
        );
    });

    it("clears the search result list when reset is clicked", async () => {
        const mockGetSearchResponse: UrlToMusicGetSearchResponse = {
            searchResults: [{ title: "Some Search Result", id: "abc123" }],
        };

        render(<UrlToMusic />, { wrapper: Wrapper });

        await userEvent.click(
            screen.getByRole("button", { name: /URL to Music/i })
        );

        const termsInput = await screen.findByRole("textbox", {
            name: "Search terms",
        });
        fireEvent.change(termsInput, { target: { value: "some terms" } });

        fetchMock.mockResponse(JSON.stringify(mockGetSearchResponse));
        userEvent.click(screen.getByRole("button", { name: "search" }));

        const resultItem = await screen.findByText("Some Search Result");
        expect(resultItem).toBeVisible();

        userEvent.click(screen.getByRole("button", { name: "reset" }));

        await waitFor(() =>
            expect(
                screen.queryByText("Some Search Result")
            ).not.toBeInTheDocument()
        );
        expect(termsInput).toHaveValue("");
    });
});
