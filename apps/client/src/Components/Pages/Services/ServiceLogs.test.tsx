import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import { render, screen } from "@testing-library/react";
import { FC, ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router";
import { servicesApi } from "../../../Services/servicesApi";
import fetchMock, { enableFetchMocks } from "../../../test/mswFetchMock";
import { MockStoreProvider } from "../../../testHelpers";
import createThemeWithMode from "../../../theme";
import ServiceLogs from "./ServiceLogs";

enableFetchMocks();

const Wrapper: FC<{ children: ReactNode }> = ({ children }) => (
    <StyledEngineProvider injectFirst>
        <ThemeProvider theme={createThemeWithMode("dark")}>
            <MemoryRouter initialEntries={["/services/logs/c1"]}>
                <MockStoreProvider apis={[servicesApi]}>
                    <Routes>
                        <Route path="/services/logs/:id" element={children} />
                    </Routes>
                </MockStoreProvider>
            </MemoryRouter>
        </ThemeProvider>
    </StyledEngineProvider>
);

describe("ServiceLogs page", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        fetchMock.mockResponse(
            JSON.stringify({
                status: "received",
                logs: "line one\nline two\n",
            })
        );
    });

    it("renders the container logs for the route id", async () => {
        render(<ServiceLogs />, { wrapper: Wrapper });

        expect(await screen.findByText(/line one/)).toBeVisible();
        expect(screen.getByText(/Logs · c1/)).toBeVisible();
    });
});
