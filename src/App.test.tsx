import React from "react";
import { renderWithProviders } from "./testHelpers";
import App from "./App";
import { RootState } from "./Reducers";
import authenticationReducer from "./Components/Providers/Authentication/authenticationSlice";
import appStatusReducer from "./Components/Molecules/AppStatusButton/appStatusSlice";
import { waitFor } from "@testing-library/dom";

type MockRootState = Pick<RootState, "authentication" | "appStatus">;

const mockRootState: MockRootState = {
    authentication: {
        id: 0,
        name: "",
        error: false,
        isLoading: false,
    },
    appStatus: {
        status: "",
        error: false,
        isLoading: false,
    },
};

const renderApp = (initialState: MockRootState) =>
    renderWithProviders(<App />, {
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
describe("App with Authentication", () => {
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
                name: "SomeUser",
            },
        });
        expect(getByText("SomeStatus")).toBeInTheDocument();
        expect(getByText("Hi, SomeUser!")).toBeInTheDocument();
    });
});
