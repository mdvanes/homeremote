import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import { RenderOptions, RenderResult, render } from "@testing-library/react";
import { FC, ReactElement, ReactNode } from "react";
import { MemoryRouter } from "react-router";
import createThemeWithMode from "../theme";

/**
 * Shared test wrapper for components that use react-router hooks/components
 * (`Link`, `useNavigate`, `useParams`, `useSearchParams`, `useBlocker`, ...).
 * Wraps the themed MUI providers around a `MemoryRouter` so router-aware
 * components render the same in tests as inside the real `<BrowserRouter>` in
 * App.tsx. Compose with `MockStoreProvider` (see testHelpers.tsx) as a nested
 * wrapper when the component under test also needs a Redux store / RTK Query
 * APIs.
 */
export const RouterTestWrapper: FC<{
    children: ReactNode;
    initialEntries?: string[];
}> = ({ children, initialEntries = ["/"] }) => (
    <StyledEngineProvider injectFirst>
        <ThemeProvider theme={createThemeWithMode("dark")}>
            <MemoryRouter initialEntries={initialEntries}>
                {children}
            </MemoryRouter>
        </ThemeProvider>
    </StyledEngineProvider>
);

interface RenderWithRouterOptions extends RenderOptions {
    initialEntries?: string[];
}

export const renderWithRouter = (
    ui: ReactElement,
    { initialEntries, ...renderOptions }: RenderWithRouterOptions = {}
): RenderResult =>
    render(ui, {
        wrapper: ({ children }) => (
            <RouterTestWrapper initialEntries={initialEntries}>
                {children}
            </RouterTestWrapper>
        ),
        ...renderOptions,
    });
