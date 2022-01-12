import React from "react";
import { render } from "@testing-library/react";
import DataLora from "./DataLora";

jest.mock("../../Molecules/DataLora/Map", () => "mock-map");

describe("DataLora page", () => {
    it("contains the Map component", () => {
        const { baseElement } = render(<DataLora />);
        expect(baseElement).toMatchSnapshot();
    });
});
