import React from "react";
import * as ReactRedux from "react-redux";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import SwitchBarList from "./SwitchBarList";
import { RootState } from "../../../Reducers";
import * as Slice from "./switchBarListSlice";

const mockUseSelectorWith = ({ isLoading = false }): void => {
    jest.spyOn(ReactRedux, "useSelector").mockReset();
    jest.spyOn(ReactRedux, "useSelector").mockImplementation(fn => {
        const mockRootState: Pick<RootState, "switchesList"> = {
            switchesList: {
                isLoading: isLoading,
                error: false,
                switches: [
                    {
                        idx: "3",
                        type: "Light/Switch",
                        name: "My Normal Light Switch",
                        status: "On",
                        dimLevel: null,
                        readOnly: false,
                        children: false,
                    },
                ],
                expanded: [],
            },
        };
        return fn(mockRootState);
    });
};

describe("SwitchBarList", () => {
    const mockDispatch = jest.fn();

    beforeEach(() => {
        jest.spyOn(ReactRedux, "useDispatch").mockReturnValue(mockDispatch);
    });

    it("shows a normal light switch", () => {
        mockUseSelectorWith({});
        const { getByText } = render(<SwitchBarList />);
        expect(getByText("My Normal Light Switch")).toBeInTheDocument();
    });

    it("sends a switch state on clicking the 'off' button", () => {
        jest.spyOn(Slice, "sendSwitchState").mockReset();

        mockUseSelectorWith({});
        const { getByText, debug, baseElement } = render(<SwitchBarList />);
        // debug(baseElement)
        // TODO fix MUI class ids (codestar repo?)
        const offButton = baseElement.querySelector(
            "button.makeStyles-root-78"
        );
        mockDispatch.mockReset();
        if (offButton) {
            fireEvent.click(offButton);
        }
        // debug(baseElement);
        expect(getByText("My Normal Light Switch")).toBeInTheDocument();
        expect(Slice.sendSwitchState).toHaveBeenCalledWith({
            id: "3",
            state: "off",
            type: "switchlight",
        });
    });

    it("shows the loading state", () => {
        mockUseSelectorWith({ isLoading: true });
        const { getByText } = render(<SwitchBarList />);
        expect(getByText("loading...")).toBeInTheDocument();
    });
});
