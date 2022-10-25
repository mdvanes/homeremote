import { fireEvent, render, screen } from "@testing-library/react";
import { FC, ReactNode } from "react";
import DataLora from "./DataLora";
import { dataloraApi } from "../../../Services/dataloraApi";
import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import { MockStoreProvider } from "../../../testHelpers";
import { PolylineProps } from "react-leaflet";

// Also see: DownloadList.test.tsx
// Also see: https://medium.com/@johnmcdowell0801/testing-rtk-query-with-jest-cdfa5aaf3dc1

enableFetchMocks();

jest.mock("react-leaflet", () => {
    const MockPolyline: FC<PolylineProps> = ({ positions }) => (
        <div data-testid="mock-Polyline">{JSON.stringify(positions)}</div>
    );

    return {
        __esModule: true,
        TileLayer: () => "mock-TileLayer",
        Marker: () => "mock-Marker",
        Popup: () => "mock-Popup",
        Polyline: MockPolyline,
        useMap: () => ({
            fitBounds: () => ({}),
        }),
        MapContainer: ({ children }: { children: ReactNode }) => (
            <div data-testid="mock-MapContainer">{children}</div>
        ),
    };
});

const otherMockResponse = JSON.stringify({
    data: [
        {
            loc: [1, 1],
            time: "2022-01-10T11:35:11.541045089Z",
        },
        {
            loc: [52.1, 4.31],
            time: "2022-01-10T11:35:11.541045089Z",
        },
    ],
});

describe("DataLora", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        fetchMock.mockResponse(
            JSON.stringify({
                data: [
                    {
                        loc: [52.1, 4.11],
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
            <MockStoreProvider apis={[dataloraApi]}>
                <DataLora />
            </MockStoreProvider>
        );

        expect(
            screen.queryByText(/\[\[52\.1,4\.11\],\[52\.1,4\.31\]\]/)
        ).not.toBeInTheDocument();
        expect(
            await screen.findByText(/\[\[52\.1,4\.11\],\[52\.1,4\.31\]\]/)
        ).toBeVisible();
        expect(fetchMock).toBeCalledTimes(1);
        expect((fetchMock.mock.calls[0][0] as Request).url).toBe(
            "http://localhost/api/datalora/?type=24h"
        );
    });

    it("can toggle to show all coords", async () => {
        render(
            <MockStoreProvider apis={[dataloraApi]}>
                <DataLora />
            </MockStoreProvider>
        );

        expect(
            await screen.findByText(/\[\[52\.1,4\.11\],\[52\.1,4\.31\]\]/)
        ).toBeVisible();

        const toggleButton = screen.getByRole("button", { name: "24h" });
        fetchMock.resetMocks();
        fetchMock.mockResponse(otherMockResponse);
        fireEvent.click(toggleButton); // TODO use userEvent when v14 is stable
        expect(
            await screen.findByText(/\[\[1,1\],\[52\.1,4\.31\]\]/)
        ).toBeVisible();
        expect(fetchMock).toBeCalledTimes(1);
        expect((fetchMock.mock.calls[0][0] as Request).url).toBe(
            "http://localhost/api/datalora/?type=all"
        );
    });

    it("updates manually", async () => {
        render(
            <MockStoreProvider apis={[dataloraApi]}>
                <DataLora />
            </MockStoreProvider>
        );

        expect(
            await screen.findByText(/\[\[52\.1,4\.11\],\[52\.1,4\.31\]\]/)
        ).toBeVisible();

        const toggleButton = screen.getByRole("button", { name: "update" });
        fetchMock.resetMocks();
        fetchMock.mockResponse(otherMockResponse);
        fireEvent.click(toggleButton); // TODO use userEvent when v14 is stable
        expect(
            await screen.findByText(/\[\[1,1\],\[52\.1,4\.31\]\]/)
        ).toBeVisible();
        expect(fetchMock).toBeCalledTimes(1);
        expect((fetchMock.mock.calls[0][0] as Request).url).toBe(
            "http://localhost/api/datalora/?type=24h"
        );
    });
});
