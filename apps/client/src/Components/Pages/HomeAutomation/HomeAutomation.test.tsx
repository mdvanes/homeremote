import { render } from "@testing-library/react";
import HomeAutomation from "./HomeAutomation";

vi.mock("../../Molecules/ClimateSensorsCard/ClimateSensorsCard", () => ({
    default: "mock-climatesensors-list",
}));
vi.mock("../../Molecules/SwitchesCard/SwitchesCard", () => ({
    default: "mock-switches-list",
}));

describe("HomeAutomation page", () => {
    it("contains the SwitchBarList", () => {
        const { baseElement } = render(<HomeAutomation />);
        expect(baseElement).toMatchSnapshot();
    });
});
