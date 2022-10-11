import { MuiThemeProvider, Theme, StyledEngineProvider } from "@mui/material";
import { render, screen } from "@testing-library/react";
import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import { FC } from "react";
import { serviceLinksApi } from "../../../Services/serviceLinksApi";
import { MockStoreProvider } from "../../../testHelpers";
import theme from "../../../theme";
import ServiceLinksBar from "./ServiceLinksBar";

enableFetchMocks();

const Wrapper: FC = ({ children }) => {
    return (
        <StyledEngineProvider injectFirst>
            <MuiThemeProvider theme={theme}>
                <MockStoreProvider api={serviceLinksApi}>
                    {children}
                </MockStoreProvider>
            </MuiThemeProvider>
        </StyledEngineProvider>
    );
};

describe("ServiceLinksBar", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        fetchMock.mockResponse(
            JSON.stringify({
                status: "received",
                servicelinks: [
                    {
                        url: "http://someurl.example.com",
                        label: "My Label",
                        icon: "SomeIcon",
                    },
                ],
            })
        );
    });

    it("shows a list of links", async () => {
        render(<ServiceLinksBar />, { wrapper: Wrapper });

        expect(await screen.findByText("My Label")).toBeVisible();
        expect(screen.getByRole("menuitem")).toHaveAttribute(
            "href",
            "http://someurl.example.com"
        );

        expect(fetchMock).toBeCalledTimes(1);
        expect((fetchMock.mock.calls[0][0] as Request).url).toBe(
            "http://localhost/api/servicelinks"
        );
    });
});
