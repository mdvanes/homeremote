import React from "react";
import { render } from "@testing-library/react";
import HomeAutomation from "./HomeAutomation";

jest.mock(
    "../../Molecules/SwitchBarList/SwitchBarList",
    () => "mock-switch-bar-list"
);
jest.mock("../../Molecules/GasChart/GasChart", () => "mock-gaschart");

describe("HomeAutomation page", () => {
    it("contains the SwitchBarList", () => {
        const { baseElement } = render(<HomeAutomation />);
        expect(baseElement).toMatchSnapshot();
    });
});
