import { render } from "@testing-library/react";
import DataLora from "./DataLora";

vi.mock("../../Molecules/DataLora/Map", () => ({ default: "mock-map" }));

describe("DataLora page", () => {
    it("contains the Map component", () => {
        const { baseElement } = render(<DataLora />);
        expect(baseElement).toMatchSnapshot();
    });
});
