import React from "react";
import { fireEvent } from "@testing-library/react";
import mediaQuery from "css-mediaquery";
import AppBar from "./AppBar";
import { RootState } from "../../../Reducers";
import { renderWithProviders } from "../../../testHelpers";
import authenticationReducer from "../../Providers/Authentication/authenticationSlice";

jest.mock("../AppStatusButton/AppStatusButton", () => "mock-app-status-button");

const mockToggleDrawer = jest.fn();

type MockRootState = Pick<RootState, "authentication">;

function createMatchMedia(width: number): unknown {
    return (query: string) => ({
        matches: mediaQuery.match(query, { width }),
        addListener: () => {
            /* no-op */
        },
        removeListener: () => {
            /* no-op */
        },
    });
}

const mockRootState: MockRootState = {
    authentication: {
        id: 1,
        displayName: "John",
        error: false,
        isLoading: false,
        isOffline: false,
        isSignedIn: false,
    },
};

const renderAppBar = (initialState: MockRootState) =>
    renderWithProviders(<AppBar toggleDrawer={mockToggleDrawer} />, {
        initialState,
        reducers: {
            authentication: authenticationReducer,
        },
    });

describe("AppBar", () => {
    beforeAll(() => {
        window.matchMedia = createMatchMedia(window.innerWidth) as (
            query: string
        ) => MediaQueryList;
    });

    it("has the application title", () => {
        const { getByText } = renderAppBar(mockRootState);
        expect(getByText("HomeRemote")).toBeInTheDocument();
    });

    it("has the greeting", () => {
        const { getByText } = renderAppBar(mockRootState);
        expect(getByText("Hi, John!")).toBeInTheDocument();
    });

    it("opens the drawer when the menu button is clicked", () => {
        mockToggleDrawer.mockReset();
        const { baseElement } = renderAppBar(mockRootState);
        const menuButton = baseElement.querySelector(
            "button.makeStyles-menuButton"
        );
        if (menuButton) {
            fireEvent.click(menuButton);
        }
        expect(mockToggleDrawer).toHaveBeenCalledTimes(1);
    });
});
