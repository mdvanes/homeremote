import React from "react";
import { render, fireEvent } from "@testing-library/react";
import AppBar from "./AppBar";

jest.mock("../AppStatusButton/AppStatusButton", () => "mock-app-status-button");

const mockToggleDrawer = jest.fn();

describe("AppBar", () => {
    it("has the application title", () => {
        const { getByText } = render(
            <AppBar toggleDrawer={mockToggleDrawer} />
        );
        expect(getByText("HomeRemote")).toBeInTheDocument();
    });

    it("opens the drawer when the menu button is clicked", () => {
        mockToggleDrawer.mockReset();
        const { baseElement } = render(
            <AppBar toggleDrawer={mockToggleDrawer} />
        );
        const menuButton = baseElement.querySelector(
            "button.makeStyles-menuButton"
        );
        if (menuButton) {
            fireEvent.click(menuButton);
        }
        expect(mockToggleDrawer).toHaveBeenCalledTimes(1);
    });
});
