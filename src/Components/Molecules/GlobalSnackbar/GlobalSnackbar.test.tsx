import React from "react";
import * as ReactRedux from "react-redux";
import { fireEvent, render, waitFor } from "@testing-library/react";
import GlobalSnackbar from "./GlobalSnackbar";

const mockUseSelector = jest.spyOn(ReactRedux, "useSelector");

describe("GlobalSnackbar", () => {
    it("adds a Snackbar to the page", () => {
        mockUseSelector.mockReset();
        mockUseSelector.mockImplementation((fn) => {
            return fn({
                loglines: {
                    urgentMessage: "some string",
                },
            });
        });
        const { getByTestId } = render(<GlobalSnackbar />);
        expect(getByTestId("global-snackbar")).toBeInTheDocument();
    });

    it("closes Snackbar on close button", async () => {
        mockUseSelector.mockReset();
        mockUseSelector.mockImplementation((fn) => {
            return fn({
                loglines: {
                    urgentMessage: "some string",
                },
            });
        });
        const { baseElement, queryByTestId } = render(<GlobalSnackbar />);
        const closeButton = baseElement.querySelector("button");
        if (closeButton) {
            fireEvent.click(closeButton);
        }
        await waitFor(
            () => {
                expect(
                    queryByTestId("global-snackbar")
                ).not.toBeInTheDocument();
            },
            { timeout: 1000 } // Should be removed, before the auto-healing feature of Snackbar removes it
        );
    });

    it("does not show Snackbar if there is no urgentMessage", () => {
        mockUseSelector.mockReset();
        mockUseSelector.mockImplementation((fn) => {
            return fn({
                loglines: {},
            });
        });
        const { queryByTestId } = render(<GlobalSnackbar />);
        expect(queryByTestId("global-snackbar")).not.toBeInTheDocument();
    });
});
