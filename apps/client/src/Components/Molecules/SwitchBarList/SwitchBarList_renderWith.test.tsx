import { fireEvent } from "@testing-library/react";
import SwitchBarList from "./SwitchBarList";
import { RootState } from "../../../Reducers";
import * as Slice from "./switchBarListSlice";
import { renderWithProviders } from "../../../testHelpers";
import { DomoticzTypeOptions } from "@homeremote/types";

type MockRootState = Pick<RootState, "switchesList">;

const mockRootState: MockRootState = {
    switchesList: {
        isLoading: false,
        error: false,
        switches: [
            {
                idx: "3",
                type: DomoticzTypeOptions.LightSwitch,
                name: "My Normal Light Switch",
                status: "On",
                dimLevel: null,
                readOnly: false,
                children: false,
            },
            {
                idx: "4",
                type: DomoticzTypeOptions.Group,
                name: "My Scene",
                status: "On",
                dimLevel: null,
                readOnly: false,
                children: [
                    {
                        idx: "5",
                        type: DomoticzTypeOptions.LightSwitch,
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
                type: DomoticzTypeOptions.Selector,
                name: "My Selector Switch",
                status: "FOO",
                dimLevel: 30,
                readOnly: true,
                children: false,
            },
            {
                idx: "7",
                type: DomoticzTypeOptions.LightSwitch,
                name: "My Dimmer",
                status: "FOO",
                dimLevel: 30,
                readOnly: false,
                children: false,
            },
            {
                idx: "8",
                type: DomoticzTypeOptions.LightSwitch,
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

const renderSwitchBarList = (initialState: MockRootState) =>
    renderWithProviders(<SwitchBarList />, {
        initialState,
        reducers: { switchesList: Slice.default },
    });

describe("SwitchBarList with mock Provider", () => {
    it("shows a scene switch", () => {
        const { getByText, queryByText } = renderSwitchBarList(mockRootState);
        expect(getByText(/My Scene/)).toBeInTheDocument();
        expect(queryByText(/My Nested Light Switch/)).not.toBeInTheDocument();
    });

    it("toggles on scene label click", async () => {
        const { getByText, queryByText } = renderSwitchBarList(mockRootState);
        expect(getByText(/My Scene/)).toBeInTheDocument();
        expect(queryByText(/My Nested Light Switch/)).not.toBeInTheDocument();
        fireEvent.click(getByText(/My Scene/));
        expect(queryByText(/My Nested Light Switch/)).toBeInTheDocument();
    });
});
