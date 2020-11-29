import React from "react";
import UrlToMusic from "./UrlToMusic";
import urlToMusicReducer from "./urlToMusicSlice";
import { RootState } from "../../../Reducers";
import { renderWithProviders } from "../../../testHelpers";
import { fireEvent, waitFor } from "@testing-library/dom";

const fetchSpy = jest.spyOn(window, "fetch");

type MockRootState = Pick<RootState, "urlToMusic">;

const mockRootState: MockRootState = {
    urlToMusic: {
        error: false,
        isLoading: false,
        form: {
            url: {
                value: "",
                error: false,
            },
            title: {
                value: "",
                error: false,
            },
            artist: {
                value: "",
                error: false,
            },
            album: {
                value: "",
                error: false,
            },
        },
        result: false,
    },
};

const renderUrlToMusic = (initialState: MockRootState) =>
    renderWithProviders(<UrlToMusic />, {
        initialState,
        reducers: {
            urlToMusic: urlToMusicReducer,
        },
    });

describe("UrlToMusic", () => {
    beforeEach(() => {
        const mockResponse: Partial<Response> = {
            ok: true,
            json: () =>
                Promise.resolve({
                    title: "Some Title",
                    artist: "Some Artist",
                }),
        };
        fetchSpy.mockResolvedValueOnce(mockResponse as Response);
    });

    afterEach(() => {
        fetchSpy.mockClear();
    });

    it("looks like a form", () => {
        const { asFragment } = renderUrlToMusic(mockRootState);

        expect(asFragment()).toMatchSnapshot();
    });

    it("can submit the getinfo form", async () => {
        const { getByTestId } = renderUrlToMusic(mockRootState);

        expect(getByTestId("title").querySelector("input")).toHaveDisplayValue(
            ""
        );
        const urlInput = getByTestId("url").querySelector("input");
        if (urlInput) {
            fireEvent.change(urlInput, { target: { value: "blargh" } });
        }
        const getInfoButton = getByTestId("get-info");
        fireEvent.click(getInfoButton);
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        await waitFor(() =>
            expect(
                getByTestId("title").querySelector("input")
            ).toHaveDisplayValue("Some Title")
        );
        expect(getByTestId("artist").querySelector("input")).toHaveDisplayValue(
            "Some Artist"
        );
    });
});
