import { waitFor } from "@testing-library/react";
import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import App, { AppProps } from "./App";
import appStatusReducer from "./Components/Molecules/AppStatusButton/appStatusSlice";
import authenticationReducer from "./Components/Providers/Authentication/authenticationSlice";
import { RootState } from "./Reducers";
import { renderWithProviders } from "./testHelpers";

enableFetchMocks();

type MockRootState = Pick<RootState, "authentication" | "appStatus">;

const mockRootState: MockRootState = {
    authentication: {
        id: 0,
        displayName: "",
        error: false,
        isLoading: false,
        isOffline: false,
        isSignedIn: false,
    },
    appStatus: {
        status: "",
        error: false,
        isLoading: false,
    },
};

const swCallbacks: AppProps["swCallbacks"] = {
    logSuccess: null,
    logUpdate: null,
};

const renderApp = (initialState: MockRootState) =>
    renderWithProviders(<App swCallbacks={swCallbacks} />, {
        initialState,
        reducers: {
            authentication: authenticationReducer,
            appStatus: appStatusReducer,
        },
    });

jest.mock(
    "./Components/Molecules/GlobalSnackbar/GlobalSnackbar",
    () => "mock-global-snackbar"
);

jest.mock(
    "./Components/Pages/HomeAutomation/HomeAutomation",
    () => "mock-home-automation"
);

jest.mock("./Components/Pages/DataLora/DataLora", () => "mock-data-lora");

jest.mock("./Components/Pages/Dashboard/Dashboard", () => "mock-dashboard");

describe("App with Authentication", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        // AuthenticationProvider tries to retrieve the current profile, if that fails, it will show the login screen
        fetchMock.mockReject(new Error("failed"));
    });

    it("shows the username field of the login screen before logging in", async () => {
        const { getAllByText } = renderApp(mockRootState);
        // Wait for AppSkeleton to be removed
        await waitFor(() => {
            getAllByText(/Username/);
        });
        const userNameLabel = getAllByText(/Username/i);
        expect(userNameLabel.length).toBe(2);
    });

    it("shows app status and current user after logging in", () => {
        const { getByText } = renderApp({
            appStatus: { ...mockRootState.appStatus, status: "SomeStatus" },
            authentication: {
                ...mockRootState.authentication,
                displayName: "SomeUser",
                isSignedIn: true,
            },
        });
        expect(getByText("SomeStatus")).toBeInTheDocument();
        expect(getByText("Hi, SomeUser!")).toBeInTheDocument();
    });
});
