import React from "react";
import { fireEvent, waitFor } from "@testing-library/react";
import UrlToMusic from "./UrlToMusic";
import urlToMusicReducer, { initialState } from "./urlToMusicSlice";
import { RootState } from "../../../Reducers";
import { renderWithProviders } from "../../../testHelpers";

const fetchSpy = jest.spyOn(window, "fetch");

type MockRootState = Pick<RootState, "urlToMusic">;

const mockRootState: MockRootState = {
    urlToMusic: initialState,
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
        const { asFragment } = renderUrlToMusic({
            ...mockRootState,
            urlToMusic: {
                ...initialState,
                form: {
                    ...initialState.form,
                    album: {
                        ...initialState.form.album,
                        value: "Mock Initial Album Name",
                    },
                },
            },
        });

        expect(asFragment()).toMatchSnapshot();
    });

    it("can submit the getinfo form", async () => {
        const { getByTestId } = renderUrlToMusic(mockRootState);

        expect(getByTestId("title").querySelector("input")).toHaveDisplayValue(
            ""
        );
        const urlInput = getByTestId("url").querySelector("input");
        if (urlInput) {
            fireEvent.change(urlInput, { target: { value: "Some URL" } });
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
        expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it("can submit the getmusic form", async () => {
        const mockResponse: Partial<Response> = {
            ok: true,
            json: () =>
                Promise.resolve({
                    path: "Some Path",
                    fileName: "Some FileName",
                }),
        };
        fetchSpy.mockReset().mockResolvedValueOnce(mockResponse as Response);

        const { getByTestId, getByText } = renderUrlToMusic(mockRootState);

        const urlInput = getByTestId("url").querySelector("input");
        if (urlInput) {
            fireEvent.change(urlInput, { target: { value: "Some URL" } });
        }
        const titleInput = getByTestId("title").querySelector("input");
        if (titleInput) {
            fireEvent.change(titleInput, { target: { value: "Some Title" } });
        }
        const artistInput = getByTestId("artist").querySelector("input");
        if (artistInput) {
            fireEvent.change(artistInput, { target: { value: "Some Artist" } });
        }
        const getMusicButton = getByTestId("get-music");
        fireEvent.click(getMusicButton);
        await waitFor(() =>
            expect(getByText(/Result in Some Path/)).toBeInTheDocument()
        );
        expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
});
