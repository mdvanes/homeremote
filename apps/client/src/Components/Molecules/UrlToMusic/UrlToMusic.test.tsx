import { UrlToMusicGetInfoResponse } from "@homeremote/types";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import { FC } from "react";
import { urlToMusicApi } from "../../../Services/urlToMusicApi";
import {
    createGetCalledUrl,
    MockStoreProvider,
    MockStoreProviderApi,
} from "../../../testHelpers";
import loglinesReducer from "../../Molecules/LogCard/logSlice";
import UrlToMusic from "./UrlToMusic";
import urlToMusicReducer from "./urlToMusicSlice";

enableFetchMocks();

const getCalledUrl = (callNr: number) => createGetCalledUrl(fetchMock)(callNr);

const urlToMusicSliceFakeApi: MockStoreProviderApi = {
    reducerPath: "urlToMusic",
    reducer: urlToMusicReducer,
};

const loglinesFakeApi: MockStoreProviderApi = {
    reducerPath: "loglines",
    reducer: loglinesReducer,
};

const Wrapper: FC = ({ children }) => {
    return (
        <MockStoreProvider
            apis={[urlToMusicApi, urlToMusicSliceFakeApi, loglinesFakeApi]}
        >
            {children}
        </MockStoreProvider>
    );
};

describe("UrlToMusic", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    it("shows the GetInfo form", () => {
        const { asFragment } = render(<UrlToMusic />, { wrapper: Wrapper });

        expect(asFragment()).toMatchSnapshot();
    });

    const expectSetUrl = async () => {
        const rendered = render(<UrlToMusic />, { wrapper: Wrapper });

        const urlInput = screen.getByRole("textbox", { name: "URL" });
        expect(
            screen.queryByRole("textbox", {
                name: "Title",
            })
        ).not.toBeInTheDocument();

        if (!urlInput) {
            throw Error("missing input");
        }

        fireEvent.change(urlInput, { target: { value: "Some URL" } });
        // userEvent.type(urlInput, "Some URL");
        // userEvent.tab();

        expect(fetchMock).not.toBeCalled();
        const getInfoButton = screen.getByRole("button", { name: "Get Info" });
        return { urlInput, getInfoButton, rendered };
    };

    const mockGetInfoResponse: UrlToMusicGetInfoResponse = {
        title: "Some Title",
        artist: "Some Artist",
        streamUrl: ["a"],
        versionInfo: "1",
    };

    it("can submit the getinfo form", async () => {
        const { urlInput, getInfoButton, rendered } = await expectSetUrl();

        fetchMock.mockResponse(JSON.stringify(mockGetInfoResponse));
        await userEvent.click(getInfoButton);

        const titleInput = await screen.findByRole("textbox", {
            name: "Title",
        });

        expect(urlInput).toHaveValue("Some URL");
        expect(rendered.asFragment()).toMatchSnapshot(
            "shows the GetMusic form"
        );

        expect(titleInput).toHaveValue("Some Title");
        expect(screen.getByRole("textbox", { name: "Artist" })).toHaveValue(
            "Some Artist"
        );
        expect(fetchMock).toBeCalledTimes(1);
        expect(getCalledUrl(0)).toBe(
            "http://localhost/api/urltomusic/getinfo/Some%20URL"
        );
    });

    it("can handle getinfo error", async () => {
        const { getInfoButton } = await expectSetUrl();

        fetchMock.mockReject(Error("some getinfo error"));
        await userEvent.click(getInfoButton);

        expect(
            screen.getByText("[FETCH_ERROR] Error: some getinfo error")
        ).toBeVisible();
    });

    it("can submit the getmusic form", async () => {
        const { getInfoButton } = await expectSetUrl();

        fetchMock.mockResponse(JSON.stringify(mockGetInfoResponse));
        await userEvent.click(getInfoButton);

        const titleInput = await screen.findByRole("textbox", {
            name: "Title",
        });

        if (titleInput) {
            fireEvent.change(titleInput, {
                target: { value: "Some Other Title" },
            });
        }

        const getMusicButton = screen.getByRole("button", {
            name: "Get Music",
        });

        fetchMock.mockReset();
        // const mockGetMusicResponse: UrlToMusicGetMusicResponse = {};
        // fetchMock.mockResponses(JSON.stringify(mockGetInfoResponse));
        await userEvent.click(getMusicButton);

        expect(fetchMock).toBeCalledTimes(1);
        expect(getCalledUrl(0)).toBe(
            "http://localhost/api/urltomusic/getmusic/Some%20URL?artist=Some%20Artist&title=Some%20Other%20Title&album=Songs%20from%202022"
        );
    });
});
