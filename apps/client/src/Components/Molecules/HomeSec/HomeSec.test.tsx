import { render, screen } from "@testing-library/react";
import { jukeboxApi } from "../../../Services/jukeboxApi";
import { MockStoreProvider } from "../../../testHelpers";
import { FC, ReactNode } from "react";
import HomeSec from "./HomeSec";
import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import { HomesecStatusResponse, PlaylistsResponse } from "@homeremote/types";
import { homesecApi } from "../../../Services/homesecApi";

enableFetchMocks();

const Wrapper: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <MockStoreProvider apis={[homesecApi]}>{children}</MockStoreProvider>
    );
};

describe("HomeSec", () => {
    it("shows status and list of devices", async () => {
        const mockStatusResponse: HomesecStatusResponse = {
            status: "Disarm",
            devices: [
                {
                    id: "1",
                    name: "Front door",
                    status: "Door Close",
                    rssi: "Strong, 9",
                    type_f: "Door Contact",
                },
            ],
        };
        fetchMock.mockResponse(JSON.stringify(mockStatusResponse));
        render(<HomeSec />, { wrapper: Wrapper });

        await screen.findByText("sensor_door");
        expect(screen.getByText("Front door")).toBeVisible();
    });
});
