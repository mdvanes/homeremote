import { ServiceLink } from "@homeremote/types";
import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import { render, screen } from "@testing-library/react";
import createThemeWithMode from "../../../theme";
import { ServiceLinkBar } from "./ServiceLinkBar";

const theme = createThemeWithMode("dark");

const renderWithTheme = (links: ServiceLink[]) =>
    render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <ServiceLinkBar links={links} />
            </ThemeProvider>
        </StyledEngineProvider>
    );

describe("ServiceLinkBar", () => {
    const links: ServiceLink[] = [
        { label: "plain", url: "http://a", icon: "" },
        { label: "iconed", url: "http://b", icon: "grafana" },
    ];

    it("sorts links with a custom icon before links without one", () => {
        renderWithTheme(links);

        const iconedLink = screen.getByLabelText("iconed");
        const plainLink = screen.getByText("plain");
        expect(
            iconedLink.compareDocumentPosition(plainLink) &
                Node.DOCUMENT_POSITION_FOLLOWING
        ).toBeTruthy();
    });

    it("gives icon links the primary color", () => {
        renderWithTheme(links);

        const iconedLink = screen.getByLabelText("iconed");
        expect(iconedLink).toHaveStyle({ color: theme.palette.primary.main });
    });

    it("does not render an external-link icon on plain links", () => {
        renderWithTheme(links);

        expect(screen.queryByTestId("OpenInNewIcon")).not.toBeInTheDocument();
    });
});
