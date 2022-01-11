import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FC } from "react";
import { DownloadItem } from "../../../ApiTypes/downloadlist.types";
import DownloadList from "./DownloadList";
import { downloadListApi } from "../../../Services/downloadListApi";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

const fetchSpy = jest.spyOn(window, "fetch");

const mockDownload: DownloadItem = {
    id: 14,
    name: "SomeName",
    state: "SomeState",
    simpleState: "downloading",
    uploadSpeed: "100 kB",
    downloadSpeed: "200 kB",
    eta: "100H",
    percentage: 50,
    size: "4GB",
};

const createMockResponse = (mockDownload: DownloadItem): Partial<Response> => {
    const data = {
        status: "received",
        downloads: [mockDownload],
    };
    const responseBlob = new Blob([JSON.stringify(data)], {
        type: "application/json",
    });
    const cloneResponse = new Response(responseBlob, {
        status: 200,
    });
    return {
        bodyUsed: false,
        status: 200,
        json: () =>
            Promise.resolve({
                status: "received",
                downloads: [mockDownload],
            }),
        text: () => Promise.resolve(JSON.stringify(data)),
        clone: () => cloneResponse,
    };
};

const MockStoreProvider: FC = ({ children }) => {
    const rootReducer = combineReducers({
        [downloadListApi.reducerPath]: downloadListApi.reducer,
    });

    const store = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(downloadListApi.middleware),
    });

    return <Provider store={store}>{children}</Provider>;
};

describe("DownloadList", () => {
    beforeEach(() => {
        const mockResponse = createMockResponse(mockDownload);
        fetchSpy.mockResolvedValue(mockResponse as Response);
        jest.useFakeTimers();
    });

    it("renders download info", async () => {
        render(
            <MockStoreProvider>
                <DownloadList />
            </MockStoreProvider>
        );

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
        render(
            <MockStoreProvider>
                <DownloadList />
            </MockStoreProvider>
        );

        await waitFor(() => {
            expect(screen.getByText("SomeName")).toBeInTheDocument();
        });
        expect(screen.queryByText("SomePausedState")).not.toBeInTheDocument();
        const toggleButton = screen.getByRole("button");

        const mockResponse = createMockResponse({
            ...mockDownload,
            state: "SomePausedState",
            simpleState: "paused",
        });

        fetchSpy.mockReset();
        // Fetch for pauseDownload and getDownloadList (on interval)
        fetchSpy.mockResolvedValue(mockResponse as Response);
        expect(fetchSpy).not.toBeCalled();
        fireEvent.click(toggleButton);
        expect(screen.queryByText("SomeState")).not.toBeInTheDocument();
        await screen.findByText("SomePausedState");
        expect(fetchSpy).toBeCalledTimes(2);
        expect(fetchSpy).toBeCalledWith(
            // "/api/downloadlist/pauseDownload/14",
            expect.objectContaining({
                url: "/api/downloadlist/pauseDownload/14",
            })
        );
    });
});
