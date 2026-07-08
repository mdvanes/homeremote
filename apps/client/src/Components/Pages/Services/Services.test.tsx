import { ServicesResponse } from "@homeremote/types";
import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FC, ReactNode } from "react";
import { MemoryRouter } from "react-router";
import { servicesApi } from "../../../Services/servicesApi";
import fetchMock, { enableFetchMocks } from "../../../test/mswFetchMock";
import {
    createGetCalledMethod,
    createGetCalledUrl,
    MockStoreProvider,
} from "../../../testHelpers";
import createThemeWithMode from "../../../theme";
import Services from "./Services";

enableFetchMocks();

const Wrapper: FC<{ children: ReactNode }> = ({ children }) => (
    <StyledEngineProvider injectFirst>
        <ThemeProvider theme={createThemeWithMode("dark")}>
            <MemoryRouter initialEntries={["/services"]}>
                <MockStoreProvider apis={[servicesApi]}>
                    {children}
                </MockStoreProvider>
            </MemoryRouter>
        </ThemeProvider>
    </StyledEngineProvider>
);

const response: ServicesResponse = {
    status: "received",
    stacks: [
        {
            Id: "1",
            Name: "monitoring",
            source: "portainer",
            endpointId: 1,
            portainerStatus: 1,
            health: "running",
            containers: [
                {
                    Id: "c1",
                    Name: "grafana",
                    Image: "grafana/grafana:latest",
                    state: "running",
                    status: "Up 3 hours",
                    health: "running",
                    createdAt: Math.floor(Date.now() / 1000) - 3 * 86400,
                    ports: [
                        {
                            publicPort: 3000,
                            privatePort: 3000,
                            type: "tcp",
                            internal: false,
                        },
                    ],
                },
            ],
            link: { type: "port", port: 3000, url: "http://homeserver:3000" },
        },
        {
            Id: "3",
            Name: "media",
            source: "portainer",
            endpointId: 1,
            portainerStatus: 2,
            health: "stopped",
            containers: [
                {
                    Id: "c2",
                    Name: "jellyfin",
                    Image: "jellyfin/jellyfin:latest",
                    state: "exited",
                    status: "Exited (0) 2 hours ago",
                    health: "stopped",
                    ports: [],
                },
            ],
            link: { type: "none" },
        },
    ],
    serviceLinks: [],
    summary: { healthy: 1, degraded: 0, stopped: 1 },
};

describe("Services page", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        fetchMock.mockResponse(JSON.stringify(response));
    });

    it("renders the first stack's containers by default", async () => {
        render(<Services />, { wrapper: Wrapper });

        expect(await screen.findByText("grafana")).toBeVisible();
        expect(screen.getByText("grafana/grafana:latest")).toBeVisible();
        expect(screen.getByText(":3000→3000")).toBeVisible();
    });

    it("switches to another stack when its tab is selected", async () => {
        render(<Services />, { wrapper: Wrapper });
        await screen.findByText("grafana");

        await userEvent.click(screen.getByRole("tab", { name: "media" }));

        expect(await screen.findByText("jellyfin")).toBeVisible();
    });

    it("persists an FQDN link config via PUT", async () => {
        const getUrl = createGetCalledUrl(fetchMock);
        const getMethod = createGetCalledMethod(fetchMock);
        render(<Services />, { wrapper: Wrapper });
        await screen.findByText("grafana");

        await userEvent.click(screen.getByText("Service link"));
        await userEvent.click(
            screen.getByRole("radio", { name: "FQDN (Caddy)" })
        );
        await userEvent.type(
            screen.getByLabelText("FQDN"),
            "grafana.home.arpa"
        );
        await userEvent.click(screen.getByRole("button", { name: "Save" }));

        await waitFor(() => {
            const index = fetchMock.mock.calls.findIndex(
                (_call, i) =>
                    getMethod(i) === "PUT" &&
                    getUrl(i).includes("/api/services/link/monitoring")
            );
            expect(index).toBeGreaterThanOrEqual(0);
        });
    });
});
