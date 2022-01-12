import { render, screen } from "@testing-library/react";
import { ReactNode } from "react";
import DataLora from "./DataLora";
import { dataloraApi } from "../../../Services/dataloraApi";
import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import { MockStoreProvider } from "../../../testHelpers";

// Also see: DownloadList.test.tsx
// Also see: https://medium.com/@johnmcdowell0801/testing-rtk-query-with-jest-cdfa5aaf3dc1

enableFetchMocks();

// import { MapContainer } from "react-leaflet";
jest.mock("react-leaflet", () => {
    return {
        __esModule: true,
        // MapContainer: () => "mock-map-container",
        MapContainer: ({ children }: { children: ReactNode }) => (
            <div>{children}</div>
        ),
    };
});

// TODO don't mock this, but mock the useMock dependency inside
// import MapContent from "./MapContent";
// jest.mock("./MapContent", () => "mock-map-content");
jest.mock("./MapContent", () => {
    return {
        __esModule: true,
        default: ({ coords }: any) => <div>{JSON.stringify(coords)}</div>,
    };
});

describe("DataLora", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        fetchMock.mockResponse(
            JSON.stringify({
                data: [
                    {
                        loc: [52.1, 4.3],
                        time: "2022-01-10T11:35:11.541045089Z",
                    },
                    {
                        loc: [52.1, 4.31],
                        time: "2022-01-10T11:35:11.541045089Z",
                    },
                ],
            })
        );
    });

    it("retrieves coords", async () => {
        render(
            <MockStoreProvider api={dataloraApi}>
                <DataLora />
            </MockStoreProvider>
        );

        expect(screen.queryByText(/52\.1/)).not.toBeInTheDocument();
        expect(await screen.findByText(/52\.1/)).toBeVisible();
        // screen.debug();
        expect(fetchMock).toBeCalledTimes(1);
    });

    // it("can toggle download", async () => {
    //     const mockToggleResponse = JSON.stringify({
    //         status: "received",
    //         downloads: [
    //             {
    //                 ...mockDownload,
    //                 state: "SomePausedState",
    //                 simpleState: "paused",
    //             },
    //         ],
    //     });

    //     render(
    //         <MockStoreProvider>
    //             <DownloadList />
    //         </MockStoreProvider>
    //     );

    //     expect(await screen.findByText("SomeName")).toBeVisible();
    //     expect(screen.queryByText("SomePausedState")).not.toBeInTheDocument();
    //     const toggleButton = screen.getByRole("button");

    //     // const mockResponse = createMockResponse({
    //     //     ...mockDownload,
    //     //     state: "SomePausedState",
    //     //     simpleState: "paused",
    //     // });

    //     // fetchSpy.mockReset();
    //     fetchMock.mockReset();
    //     fetchMock.mockResponses(mockToggleResponse, mockToggleResponse);
    //     // Fetch for pauseDownload and getDownloadList (on interval)
    //     // fetchSpy.mockResolvedValue(mockResponse as Response);
    //     // expect(fetchSpy).not.toBeCalled();
    //     fireEvent.click(toggleButton);
    //     expect(screen.queryByText("SomeState")).not.toBeInTheDocument();
    //     expect(await screen.findByText("SomePausedState")).toBeVisible();
    //     expect(fetchMock).toBeCalledTimes(2);
    //     expect(fetchMock).toBeCalledWith(
    //         // "/api/downloadlist/pauseDownload/14",
    //         // expect.objectContaining({
    //         //     url: "/api/downloadlist/pauseDownload/14",
    //         // })
    //         expect.objectContaining({
    //             [Symbol("Request internal")]: expect.objectContaining({
    //                 parsedURL: expect.objectContaining({
    //                     pathname: "/api/downloadlist/pauseDownload/145",
    //                 }),
    //             }),
    //         })
    //     );
    // });
});
