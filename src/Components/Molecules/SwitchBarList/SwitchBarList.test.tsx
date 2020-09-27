import React from "react";
import * as ReactRedux from "react-redux";
import { render, fireEvent } from "@testing-library/react";
import SwitchBarList from "./SwitchBarList";
import { RootState } from "../../../Reducers";
import * as Slice from "./switchBarListSlice";
import SwitchBar from "./SwitchBar";

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
        const { getByText, baseElement } = render(<SwitchBarList />);
        const offButton = baseElement.querySelector("button.makeStyles-root");
        expect(offButton).toBeInTheDocument();
        mockDispatch.mockReset();
        if (offButton) {
            fireEvent.click(offButton);
        }
        expect(getByText("My Normal Light Switch")).toBeInTheDocument();
        expect(Slice.sendSwitchState).toHaveBeenCalledWith({
            id: "3",
            state: "off",
            type: "switchlight",
        });
    });

    it("shows the loading state", () => {
        mockUseSelectorWith({ isLoading: true });
        const { baseElement } = render(<SwitchBarList />);
        expect(
            baseElement.querySelector(".MuiLinearProgress-root")
        ).toBeInTheDocument();
    });
});

describe("SwitchBar", () => {
    it("can show an icon", () => {
        const { baseElement } = render(
            <SwitchBar
                icon="foo"
                leftButton={<button>left</button>}
                rightButton={<button>right</button>}
                label="my bar"
                labelAction={false}
            />
        );
        expect(baseElement.querySelector(".MuiIcon-root")?.textContent).toBe(
            "foo"
        );
    });

    it("can have a text label", () => {
        const { baseElement } = render(
            <SwitchBar
                icon={false}
                leftButton={<button>left</button>}
                rightButton={<button>right</button>}
                label="my bar"
                labelAction={false}
            />
        );
        expect(
            baseElement.querySelector(".makeStyles-label")
        ).toHaveTextContent("my bar");
        expect(
            baseElement.querySelector(".makeStyles-label > button")
        ).not.toBeInTheDocument();
    });

    it("can have a button label", () => {
        const { baseElement } = render(
            <SwitchBar
                icon={false}
                leftButton={<button>left</button>}
                rightButton={<button>right</button>}
                label="my bar"
                labelAction={jest.fn()}
            />
        );
        expect(
            baseElement.querySelector(".makeStyles-label")
        ).toHaveTextContent("my bar");
        expect(
            baseElement.querySelector(".makeStyles-label > button")
        ).toBeInTheDocument();
    });
});
