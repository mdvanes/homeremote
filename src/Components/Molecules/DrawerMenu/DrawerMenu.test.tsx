import React from "react";
import { render, fireEvent } from "@testing-library/react";
import DrawerMenu from "./DrawerMenu";

jest.mock("react-router-dom", () => ({
    Link: "mock-link",
}));

const mockCloseDrawer = jest.fn();

describe("DrawerMenu", () => {
    beforeEach(() => {
        mockCloseDrawer.mockReset();
    });

    it("has Dashboard link", () => {
        const { getByText } = render(
            <DrawerMenu closeDrawer={mockCloseDrawer} />
        );
        expect(getByText("Dashboard")).toBeInTheDocument();
    });

    it("closes the drawer after a menu item is clicked", () => {
        const { getByText } = render(
            <DrawerMenu closeDrawer={mockCloseDrawer} />
        );
        fireEvent.click(getByText("Dashboard"));
        expect(mockCloseDrawer).toHaveBeenCalledTimes(1);
    });

    it("logouts on logout link click", () => {
        interface MockWindow {
            location?: Location;
        }
        const oldLocation = window.location;
        delete (window as MockWindow).location;
        window.location = {
            ...oldLocation,
            href: "/foo",
        };
        expect(window.location.href).toBe("/foo");
        const { getByText } = render(
            <DrawerMenu closeDrawer={mockCloseDrawer} />
        );
        fireEvent.click(getByText("Log out"));
        expect(mockCloseDrawer).toHaveBeenCalledTimes(1);
        expect(window.location.href).toBe("/");
    });
});
