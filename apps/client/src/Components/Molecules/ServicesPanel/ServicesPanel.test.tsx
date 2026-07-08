import { ServicesResponse } from "@homeremote/types";
import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FC, ReactNode } from "react";
import { servicesApi } from "../../../Services/servicesApi";
import fetchMock, { enableFetchMocks } from "../../../test/mswFetchMock";
import { createGetCalledUrl, MockStoreProvider } from "../../../testHelpers";
import createThemeWithMode from "../../../theme";
import ServicesPanel from "./ServicesPanel";

enableFetchMocks();

const Wrapper: FC<{ children: ReactNode }> = ({ children }) => (
    <StyledEngineProvider injectFirst>
        <ThemeProvider theme={createThemeWithMode("dark")}>
            <MockStoreProvider apis={[servicesApi]}>
                {children}
            </MockStoreProvider>
        </ThemeProvider>
    </StyledEngineProvider>
);

const response: ServicesResponse = {
    status: "received",
    stacks: [
        {
            Id: "1",
            Name: "webapp",
            source: "portainer",
            endpointId: 1,
            portainerStatus: 1,
            health: "running",
            containers: [
                {
                    Id: "c1",
                    Name: "grafana",
                    state: "running",
                    status: "Up 3 hours",
                    health: "running",
                    ports: [],
                },
            ],
            link: { type: "none" },
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
                    state: "exited",
                    status: "Exited (0) 2 hours ago",
                    health: "stopped",
                    ports: [],
                },
            ],
            link: { type: "none" },
        },
    ],
    serviceLinks: [
        { label: "openportal", url: "http://homeserver:3000", icon: "" },
    ],
    summary: { healthy: 1, degraded: 0, stopped: 1 },
};

describe("ServicesPanel", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        fetchMock.mockResponse(JSON.stringify(response));
    });

    it("shows problem stacks by default and hides healthy ones", async () => {
        render(<ServicesPanel />, { wrapper: Wrapper });

        // The stopped stack is a problem, always shown.
        expect(await screen.findByText("media")).toBeVisible();
        // The healthy stack is hidden until "Show all".
        expect(screen.queryByText("webapp")).not.toBeInTheDocument();
    });

    it("reveals healthy stacks when expanded", async () => {
        render(<ServicesPanel />, { wrapper: Wrapper });
        await screen.findByText("media");

        await userEvent.click(screen.getByLabelText("up"));

        expect(await screen.findByText("webapp")).toBeVisible();
    });

    it("renders the discovered service link bar and health footer", async () => {
        render(<ServicesPanel />, { wrapper: Wrapper });

        const link = await screen.findByRole("link", { name: "openportal" });
        expect(link).toHaveAttribute("href", "http://homeserver:3000");
        expect(screen.getByText(/1 healthy/)).toBeVisible();
        expect(screen.getByText(/1 stopped/)).toBeVisible();
    });

    it("confirms and dispatches a stack action", async () => {
        const getCalledUrl = createGetCalledUrl(fetchMock);
        render(<ServicesPanel />, { wrapper: Wrapper });
        await screen.findByText("media");

        await userEvent.click(screen.getByLabelText("Start media"));
        await userEvent.click(screen.getByRole("button", { name: "OK" }));

        await waitFor(() => {
            const urls = fetchMock.mock.calls.map((_, index) =>
                getCalledUrl(index)
            );
            expect(
                urls.some((url) =>
                    url.includes("/api/services/stack/start/3?endpointId=1")
                )
            ).toBe(true);
        });
    });
});
