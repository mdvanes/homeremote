import React, { FC, ReactElement, ReactNode } from "react";
import * as ReactRedux from "react-redux";
import {
    render,
    fireEvent,
    RenderResult,
    RenderOptions,
} from "@testing-library/react";
import SwitchBarList from "./SwitchBarList";
import { RootState } from "../../../Reducers";
import * as Slice from "./switchBarListSlice";
import SwitchBar from "./SwitchBar";
import { Provider } from "react-redux";
import { createStore, PreloadedState, Store } from "@reduxjs/toolkit";

const mockRootState: Pick<RootState, "switchesList"> = {
    switchesList: {
        isLoading: false,
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
            {
                idx: "4",
                type: "Group",
                name: "My Scene",
                status: "On",
                dimLevel: null,
                readOnly: false,
                children: [
                    {
                        idx: "5",
                        type: "Light/Switch",
                        name: "My Nested Light Switch",
                        status: "On",
                        dimLevel: null,
                        readOnly: false,
                        children: false,
                    },
                ],
            },
            {
                idx: "6",
                type: "Selector",
                name: "My Selector Switch",
                status: "FOO",
                dimLevel: 30,
                readOnly: true,
                children: false,
            },
            {
                idx: "7",
                type: "Light/Switch",
                name: "My Dimmer",
                status: "FOO",
                dimLevel: 30,
                readOnly: false,
                children: false,
            },
            {
                idx: "8",
                type: "Light/Switch",
                name: "Blinds",
                status: "FOO",
                dimLevel: null,
                readOnly: false,
                children: false,
            },
        ],
        expanded: [],
    },
};

const mockUseSelectorWith = ({ isLoading = false }): void => {
    jest.spyOn(ReactRedux, "useSelector").mockReset();
    jest.spyOn(ReactRedux, "useSelector").mockImplementation((fn) => {
        return fn({
            ...mockRootState,
            switchesList: { ...mockRootState.switchesList, isLoading },
        });
    });
};

interface Foo extends RenderOptions {
    initialState: any; // PreloadedState<RootState>; TODO
    store?: Store;
}

type RenderWithProviders = (ui: ReactElement, options: Foo) => RenderResult;

const renderWithProviders: RenderWithProviders = (
    ui,
    {
        initialState,
        store = createStore(Slice.default, initialState),
        ...renderOptions
    } //  = {} TODO
) => {
    const Wrapper: FC = ({ children }) => {
        return <Provider store={store}>{children}</Provider>;
    };
    return render(ui, { wrapper: Wrapper, ...renderOptions });
};

describe("SwitchBarList", () => {
    const mockDispatch = jest.fn();

    beforeEach(() => {
        jest.spyOn(ReactRedux, "useDispatch").mockReturnValue(mockDispatch);
    });

    it("shows a normal light switch", () => {
        mockUseSelectorWith({});
        const { getByText, getByTestId } = render(<SwitchBarList />);
        expect(getByText("My Normal Light Switch")).toBeInTheDocument();
        // Test icons
        expect(
            getByTestId("switchbar-My Normal Light Switch")
        ).toMatchSnapshot();
    });

    it("shows a selector switch", () => {
        mockUseSelectorWith({});
        const { getByText, getByTestId } = render(<SwitchBarList />);
        expect(getByText(/My Selector Switch: armed/)).toBeInTheDocument();
        // Test read only state
        expect(
            getByTestId("switchbar-My Selector Switch: armed")
        ).toMatchSnapshot();
    });

    it("shows a dimmer", () => {
        mockUseSelectorWith({});
        const { getByText } = render(<SwitchBarList />);
        expect(getByText(/My Dimmer \(30%\)/)).toBeInTheDocument();
    });

    it("shows a blinds switch", () => {
        mockUseSelectorWith({});
        const { getByText, getByTestId } = render(<SwitchBarList />);
        expect(getByText("Blinds")).toBeInTheDocument();
        // Test icons
        expect(getByTestId("switchbar-Blinds")).toMatchSnapshot();
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

    it("sends a switch state on clicking the 'on' button", () => {
        jest.spyOn(Slice, "sendSwitchState").mockReset();
        mockUseSelectorWith({});
        const { getByText, baseElement } = render(<SwitchBarList />);
        const onButton = baseElement.querySelector("button.makeStyles-active");
        expect(onButton).toBeInTheDocument();
        mockDispatch.mockReset();
        if (onButton) {
            fireEvent.click(onButton);
        }
        expect(getByText("My Normal Light Switch")).toBeInTheDocument();
        expect(Slice.sendSwitchState).toHaveBeenCalledWith({
            id: "3",
            state: "on",
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

describe("SwitchBarList with mock Provider", () => {
    const mockDispatch = jest.fn();

    beforeEach(() => {
        jest.spyOn(ReactRedux, "useDispatch").mockReturnValue(mockDispatch);
    });

    it("shows a scene switch", () => {
        jest.spyOn(ReactRedux, "useSelector").mockRestore();
        const { getByText, queryByText } = renderWithProviders(
            <SwitchBarList />,
            {
                initialState: mockRootState,
            }
        );
        expect(getByText(/My Scene/)).toBeInTheDocument();
        expect(queryByText(/My Nested Light Switch/)).not.toBeInTheDocument();
    });

    it("toggles on scene label click", () => {
        jest.spyOn(ReactRedux, "useSelector").mockRestore();
        const { getByText, queryByText } = renderWithProviders(
            <SwitchBarList />,
            {
                initialState: mockRootState,
            }
        );
        expect(getByText(/My Scene/)).toBeInTheDocument();
        expect(queryByText(/My Nested Light Switch/)).not.toBeInTheDocument();
        fireEvent.click(getByText(/My Scene/));
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                payload: { sceneIdx: "4" },
                type: Slice.toggleExpandScene.type,
            })
        );
    });

    it("shows child of expanded scene switch", () => {
        jest.spyOn(ReactRedux, "useSelector").mockRestore();
        const { getByText, queryByText } = renderWithProviders(
            <SwitchBarList />,
            {
                initialState: {
                    ...mockRootState,
                    switchesList: {
                        ...mockRootState.switchesList,
                        expanded: ["4"],
                    },
                },
            }
        );
        expect(getByText(/My Scene/)).toBeInTheDocument();
        expect(queryByText(/My Nested Light Switch/)).toBeInTheDocument();
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
