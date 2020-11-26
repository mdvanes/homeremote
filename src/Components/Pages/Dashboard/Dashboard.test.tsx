import React from "react";
import { render } from "@testing-library/react";
import Dashboard from "./Dashboard";

jest.mock(
    "../../Molecules/SwitchBarList/SwitchBarList",
    () => "mock-switch-bar-list"
);

jest.mock("../../Molecules/LogCard/LogCard", () => "mock-log-card");

jest.mock("../../Molecules/UrlToMusic/UrlToMusic", () => "mock-url-to-music");

jest.mock("@mdworld/homeremote-stream-player", () => "mock-stream-player");

describe("Dashboard page", () => {
    it("contains all the control components", () => {
        const { baseElement } = render(<Dashboard />);
        expect(baseElement).toMatchSnapshot();
    });
});
