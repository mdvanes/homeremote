import { render } from "@testing-library/react";
import Log from "./Log";

vi.mock("../../Molecules/LogCard/LogCard", () => ({
    default: "mock-log-card",
}));

describe("Log page", () => {
    it("contains the LogCard", () => {
        const { baseElement } = render(<Log />);
        expect(baseElement).toMatchSnapshot();
    });
});
