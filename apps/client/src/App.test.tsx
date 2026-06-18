import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { waitFor } from "@testing-library/react";
import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import App, { AppProps } from "./App";
import appStatusReducer from "./Components/Molecules/AppStatusButton/appStatusSlice";
import authenticationReducer from "./Components/Providers/Authentication/authenticationSlice";
import { RootState } from "./Reducers";
import { emptyApi } from "./Services/emptyApi";
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
        oidcEnabled: false,
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
        // The persistent MusicBar mounts HotKeyProvider, which subscribes to the
        // generated nowplaying API, so its reducer + middleware must be present.
        store: configureStore({
            reducer: combineReducers({
                authentication: authenticationReducer,
                appStatus: appStatusReducer,
                [emptyApi.reducerPath]: emptyApi.reducer,
            }),
            preloadedState: initialState,
            middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware().concat(emptyApi.middleware),
        }),
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

jest.mock("./Components/Molecules/MusicBar/MusicBar", () => ({
    __esModule: true,
    default: () => "mock-music-bar",
    MUSIC_BAR_HEIGHT: 180,
}));

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
