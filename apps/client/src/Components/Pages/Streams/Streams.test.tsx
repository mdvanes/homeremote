import React from "react";
import { render } from "@testing-library/react";
import Streams from "./Streams";

jest.mock("@mdworld/homeremote-stream-player", () => "mock-stream-player");
jest.mock("../../Molecules/Jukebox/Jukebox", () => "mock-jukebox");

describe("Streams page", () => {
    it("contains the stream player", () => {
        const { baseElement } = render(<Streams />);
        expect(baseElement).toMatchSnapshot();
    });
});
