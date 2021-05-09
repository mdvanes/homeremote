import React from "react";
import { fireEvent } from "@testing-library/react";
import DrawerMenu from "./DrawerMenu";
import authenticationReducer from "../../Providers/Authentication/authenticationSlice";
import { renderWithProviders } from "../../../testHelpers";
import { RootState } from "../../../Reducers";

type MockRootState = Pick<RootState, "authentication">;

const mockRootState: MockRootState = {
    authentication: {
        id: 0,
        displayName: "",
        error: false,
        isLoading: false,
        isOffline: false,
        isSignedIn: false,
    },
};

const mockCloseDrawer = jest.fn();

const renderDrawerMenu = (initialState: MockRootState) =>
    renderWithProviders(<DrawerMenu closeDrawer={mockCloseDrawer} />, {
        initialState,
        reducers: {
            authentication: authenticationReducer,
        },
    });

// https://codeburst.io/module-mocking-in-jest-ff174397e5ff
jest.mock("react-router-dom", () => ({
    // Needed to overwite default in this syntax
    __esModule: true,
    default: "mock-default",
    Link: "mock-link",
    // This just returns the string mock-link instead of an <mock-link> element:  Link: () => "mock-link",
}));

const fetchSpy = jest.spyOn(window, "fetch");

describe("DrawerMenu", () => {
    beforeEach(() => {
        mockCloseDrawer.mockReset();
    });

    it("has Dashboard link", () => {
        const { getByText } = renderDrawerMenu(mockRootState);
        expect(getByText("Dashboard")).toBeInTheDocument();
    });

    it("closes the drawer after a menu item is clicked", () => {
        const { getByText } = renderDrawerMenu(mockRootState);
        fireEvent.click(getByText("Dashboard"));
        expect(mockCloseDrawer).toHaveBeenCalledTimes(1);
    });

    it("logouts on logout link click", () => {
        //     interface MockWindow {
        //         location?: Location;
        //     }
        //     const oldLocation = window.location;
        //     delete (window as MockWindow).location;
        //     window.location = {
        //         ...oldLocation,
        //         href: "/foo",
        //     };
        //     expect(window.location.href).toBe("/foo");
        const { getByText } = renderDrawerMenu(mockRootState);
        fetchSpy.mockReset();
        fireEvent.click(getByText("Log out"));
        expect(mockCloseDrawer).toHaveBeenCalledTimes(1);
        // expect(window.location.href).toBe("/");
        expect(fetchSpy).toHaveBeenCalledWith(
            "/auth/logout",
            expect.anything()
        );
    });
});
