import { render } from "@testing-library/react";
import HomeAutomation from "./HomeAutomation";

jest.mock(
    "../../Molecules/ClimateSensorsCard/ClimateSensorsCard",
    () => "mock-climatesensors-list"
);
jest.mock(
    "../../Molecules/SwitchesCard/SwitchesCard",
    () => "mock-switches-list"
);

describe("HomeAutomation page", () => {
    it("contains the SwitchBarList", () => {
        const { baseElement } = render(<HomeAutomation />);
        expect(baseElement).toMatchSnapshot();
    });
});
