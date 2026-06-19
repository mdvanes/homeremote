import { fireEvent, waitFor } from "@testing-library/react";
import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import { redirectTo } from "../../../navigation";
import { RootState } from "../../../Reducers";
import { renderWithProviders } from "../../../testHelpers";
import createThemeWithMode from "../../../theme";
import authenticationReducer from "./authenticationSlice";
import LoginPage from "./LoginPage";

enableFetchMocks();

jest.mock("../../../navigation");

const mockedRedirectTo = redirectTo as jest.MockedFunction<typeof redirectTo>;

jest.mock("../../../theme", () => {
    const actual = jest.requireActual("../../../theme");
    return { __esModule: true, default: jest.fn(actual.default) };
});

const mockedCreateThemeWithMode = createThemeWithMode as jest.MockedFunction<
    typeof createThemeWithMode
>;

// fetchToJson calls fetch(urlString, init), so the recorded first argument is a
// plain string (not a Request like RTK Query produces).
const urlOf = (call: [unknown, ...unknown[]]): string =>
    typeof call[0] === "string" ? call[0] : (call[0] as Request).url;
const methodOf = (call: [unknown, ...unknown[]]): string | undefined =>
    (call[1] as RequestInit | undefined)?.method;

type MockRootState = Pick<RootState, "authentication">;

const baseAuthState: MockRootState["authentication"] = {
    id: 0,
    displayName: "",
    error: false,
    isLoading: false,
    isOffline: false,
    isSignedIn: false,
    oidcEnabled: false,
};

const setPrefersDarkMode = (matches: boolean): void => {
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
        matches,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    }));
};

const renderLoginPage = (oidcEnabled: boolean) =>
    renderWithProviders(<LoginPage />, {
        initialState: {
            authentication: { ...baseAuthState, oidcEnabled },
        },
        reducers: {
            authentication: authenticationReducer,
        },
    });

describe("LoginPage", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        fetchMock.mockResponse(JSON.stringify({ oidc: { enabled: false } }));
        mockedCreateThemeWithMode.mockClear();
        mockedRedirectTo.mockClear();
        setPrefersDarkMode(false);
    });

    it("shows the local login form", () => {
        const { getByLabelText, getByText } = renderLoginPage(false);
        expect(getByLabelText(/Username/i)).toBeInTheDocument();
        expect(getByLabelText(/Password/i)).toBeInTheDocument();
        expect(getByText("Log in")).toBeInTheDocument();
    });

    it("shows the Authentik button when OIDC is enabled", () => {
        const { getByText } = renderLoginPage(true);
        expect(getByText("Log in with Authentik")).toBeInTheDocument();
    });

    it("shows an OIDC-not-configured hint instead of the Authentik button when disabled", () => {
        const { queryByText, getByText } = renderLoginPage(false);
        expect(queryByText("Log in with Authentik")).not.toBeInTheDocument();
        expect(
            getByText(/Single sign-on \(OIDC\) is not configured/)
        ).toBeInTheDocument();
        expect(
            getByText(/see the .* section in the README/)
        ).toBeInTheDocument();
    });

    it("does not show the OIDC hint when OIDC is enabled", () => {
        const { queryByText } = renderLoginPage(true);
        expect(
            queryByText(/Single sign-on \(OIDC\) is not configured/)
        ).not.toBeInTheDocument();
    });

    it("redirects to the OIDC endpoint when the Authentik button is clicked", () => {
        const { getByText } = renderLoginPage(true);
        fireEvent.click(getByText("Log in with Authentik"));

        expect(mockedRedirectTo).toHaveBeenCalledWith(
            "http://localhost/auth/oidc"
        );
    });

    it("shows an error alert when redirected back with an OIDC error flag", () => {
        window.history.replaceState({}, "", "/?error=oidc");
        try {
            const { getByText } = renderLoginPage(true);
            expect(
                getByText(/Error logging in with Authentik/i)
            ).toBeInTheDocument();
        } finally {
            window.history.replaceState({}, "", "/");
        }
    });

    it("does not show the OIDC error alert without the error flag", () => {
        const { queryByText } = renderLoginPage(true);
        expect(
            queryByText(/Error logging in with Authentik/i)
        ).not.toBeInTheDocument();
    });

    it("requests the auth config on mount", async () => {
        renderLoginPage(false);
        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalled();
        });
        expect(urlOf(fetchMock.mock.calls[0])).toBe(
            "http://localhost/auth/config"
        );
    });

    it("posts credentials to the login endpoint on submit", async () => {
        const { getByLabelText, getByText } = renderLoginPage(false);
        fireEvent.change(getByLabelText(/Username/i), {
            target: { value: "john" },
        });
        fireEvent.change(getByLabelText(/Password/i), {
            target: { value: "secret" },
        });
        fireEvent.click(getByText("Log in"));

        await waitFor(() => {
            const loginCall = fetchMock.mock.calls.find(
                (call) => urlOf(call) === "http://localhost/auth/login"
            );
            expect(loginCall).toBeDefined();
        });
        const loginCall = fetchMock.mock.calls.find(
            (call) => urlOf(call) === "http://localhost/auth/login"
        );
        expect(methodOf(loginCall as [unknown, ...unknown[]])).toBe("POST");
    });

    it("derives a dark theme from the browser preference", () => {
        setPrefersDarkMode(true);
        renderLoginPage(false);
        expect(mockedCreateThemeWithMode).toHaveBeenCalledWith("dark");
    });

    it("derives a light theme from the browser preference", () => {
        setPrefersDarkMode(false);
        renderLoginPage(false);
        expect(mockedCreateThemeWithMode).toHaveBeenCalledWith("light");
    });
});
