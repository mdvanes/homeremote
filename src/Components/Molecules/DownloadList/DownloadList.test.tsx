import { fireEvent, screen, waitFor } from "@testing-library/react";
import React from "react";
import { RootState } from "../../../Reducers";
import { renderWithProviders } from "../../../testHelpers";
import DownloadList from "./DownloadList";
import downloadListReducer, { initialState } from "./downloadListSlice";

const fetchSpy = jest.spyOn(window, "fetch");

describe("DownloadList", () => {
    type MockRootState = Pick<RootState, "downloadList">;

    const renderDownloadList = (initialState: MockRootState) =>
        renderWithProviders(<DownloadList />, {
            initialState,
            reducers: { downloadList: downloadListReducer },
        });

    beforeEach(() => {
        const mockResponse: Partial<Response> = {
            ok: true,
            json: () =>
                Promise.resolve({
                    status: "received",
                    downloads: [
                        {
                            id: 14,
                            name: "SomeName",
                            state: "SomeState",
                            simpleState: "downloading",
                            uploadSpeed: "100 kB",
                            downloadSpeed: "200 kB",
                            eta: "100H",
                            percentage: 50,
                            size: "4GB",
                        },
                    ],
                }),
        };
        fetchSpy.mockResolvedValue(mockResponse as Response);
        jest.useFakeTimers();
    });

    it("renders download info", async () => {
        renderDownloadList({
            downloadList: initialState,
        });
        expect(screen.queryByText("SomeName")).not.toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText("SomeName")).toBeInTheDocument();
        });
        // State, download speed, upload speed
        expect(
            screen.getByText("SomeState ▼200 kB/s ▲100 kB/s")
        ).toBeInTheDocument();
        // Size, percentage, ETA
        expect(screen.getByText(/4GB/)).toBeInTheDocument();
        expect(screen.getByText(/50%/)).toBeInTheDocument();
        expect(screen.getByText(/100H remaining/)).toBeInTheDocument();
    });

    it("can toggle download", async () => {
        renderDownloadList({
            downloadList: initialState,
        });

        await waitFor(() => {
            expect(screen.getByText("SomeName")).toBeInTheDocument();
        });
        expect(screen.queryByText("SomePausedState")).not.toBeInTheDocument();

        const toggleButton = screen.getByRole("button");

        const mockResponse: Partial<Response> = {
            ok: true,
            json: () =>
                Promise.resolve({
                    status: "received",
                    downloads: [
                        {
                            id: 14,
                            name: "SomeName",
                            state: "SomePausedState",
                            simpleState: "paused",
                            uploadSpeed: "100 kB",
                            downloadSpeed: "200 kB",
                            eta: "100H",
                            percentage: 50,
                            size: "4GB",
                        },
                    ],
                }),
        };
        fetchSpy.mockReset();
        // Fetch for pauseDownload and getDownloads (on interval)
        fetchSpy.mockResolvedValue(mockResponse as Response);

        expect(fetchSpy).not.toBeCalled();
        fireEvent.click(toggleButton);

        await waitFor(() => {
            expect(screen.getByText("SomePausedState")).toBeInTheDocument();
        });
        expect(screen.queryByText("SomeState")).not.toBeInTheDocument();

        expect(fetchSpy).toBeCalledTimes(2);
        expect(fetchSpy).toBeCalledWith(
            "/api/downloadlist/pauseDownload/14",
            expect.objectContaining({})
        );
    });
});
