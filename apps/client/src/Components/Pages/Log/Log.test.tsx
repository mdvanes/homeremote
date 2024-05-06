import { render } from "@testing-library/react";
import Log from "./Log";

jest.mock("../../Molecules/LogCard/LogCard", () => "mock-log-card");

describe("Log page", () => {
    it("contains the LogCard", () => {
        const { baseElement } = render(<Log />);
        expect(baseElement).toMatchSnapshot();
    });
});
