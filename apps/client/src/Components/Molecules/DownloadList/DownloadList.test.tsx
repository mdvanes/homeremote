import {
    render,
    screen,
    waitForElementToBeRemoved,
} from "@testing-library/react";
import { DownloadItem } from "@homeremote/types";
import DownloadList from "./DownloadList";
import { downloadListApi } from "../../../Services/downloadListApi";
import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import { createGetCalledUrl, MockStoreProvider } from "../../../testHelpers";
import userEvent from "@testing-library/user-event";

const getCalledUrl = (callNr: number) => createGetCalledUrl(fetchMock)(callNr);

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

// Also see: https://medium.com/@johnmcdowell0801/testing-rtk-query-with-jest-cdfa5aaf3dc1

// Workaround to mock Fetch without jest-fetch-mock, but with clone
// const createMockResponse = (mockDownload: DownloadItem): Partial<Response> => {
//     const data = {
//         status: "received",
//         downloads: [mockDownload],
//     };
//     const responseBlob = new Blob([JSON.stringify(data)], {
//         type: "application/json",
//     });
//     const cloneResponse = new Response(responseBlob, {
//         status: 200,
//     });
//     return {
//         bodyUsed: false,
//         status: 200,
//         json: () =>
//             Promise.resolve({
//                 status: "received",
//                 downloads: [mockDownload],
//             }),
//         text: () => Promise.resolve(JSON.stringify(data)),
//         clone: () => cloneResponse,
//     };
// };

enableFetchMocks();

describe("DownloadList", () => {
    beforeEach(() => {
        // const mockResponse = createMockResponse(mockDownload);
        // fetchSpy.mockResolvedValue(mockResponse as Response);
        jest.useFakeTimers();
        fetchMock.resetMocks();
        fetchMock.mockResponse(
            JSON.stringify({
                status: "received",
                downloads: [mockDownload],
            })
        );
    });

    it("renders download info", async () => {
        render(
            <MockStoreProvider apis={[downloadListApi]}>
                <DownloadList />
            </MockStoreProvider>
        );

        expect(screen.queryByText("SomeName")).not.toBeInTheDocument();
        expect(await screen.findByText("SomeName")).toBeVisible();
        // State, download speed, upload speed
        expect(
            screen.getByText("SomeState ▼200 kB/s ▲100 kB/s")
        ).toBeInTheDocument();
        // Size, percentage, ETA
        expect(screen.getByText(/4GB/)).toBeVisible();
        expect(screen.getByText(/50%/)).toBeVisible();
        expect(screen.getByText(/100H remaining/)).toBeVisible();
        expect(fetchMock).toBeCalledTimes(1);
    });

    it("can toggle download", async () => {
        const mockToggleResponse = JSON.stringify({
            status: "received",
            downloads: [
                {
                    ...mockDownload,
                    state: "SomePausedState",
                    simpleState: "paused",
                },
            ],
        });

        render(
            <MockStoreProvider apis={[downloadListApi]}>
                <DownloadList />
            </MockStoreProvider>
        );

        expect(await screen.findByText("SomeName")).toBeVisible();
        expect(screen.queryByText("SomePausedState")).not.toBeInTheDocument();
        const toggleButton = screen.getAllByRole("button")[0];

        fetchMock.mockReset();
        fetchMock.mockResponse(mockToggleResponse);

        userEvent.click(toggleButton);
        await waitForElementToBeRemoved(() => screen.queryByText("SomeName"));
        expect(screen.queryByText("SomeState")).not.toBeInTheDocument();

        const expandButtonElem = screen.getAllByRole("button")[0];
        userEvent.click(expandButtonElem);

        const someElem = await screen.findByText("SomePausedState");
        expect(someElem).toBeVisible();
        expect(fetchMock).toBeCalledTimes(2);
        expect(getCalledUrl(0)).toBe(
            "http://localhost/api/downloadlist/pauseDownload/14"
        );
    });
});
