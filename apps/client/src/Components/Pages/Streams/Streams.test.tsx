import { render } from "@testing-library/react";
import { FC, ReactNode } from "react";
import { nowplayingApi } from "../../../Services/nowplayingApi";
import { MockStoreProvider } from "../../../testHelpers";
import Streams from "./Streams";

jest.mock("@mdworld/homeremote-stream-player", () => "mock-stream-player");
jest.mock("../../Molecules/Jukebox/Jukebox", () => "mock-jukebox");

const Wrapper: FC<{ children?: ReactNode }> = ({ children }) => {
    return (
        <MockStoreProvider apis={[nowplayingApi]}>{children}</MockStoreProvider>
    );
};

describe("Streams page", () => {
    it("contains the stream player", () => {
        const { baseElement } = render(<Streams />, { wrapper: Wrapper });
        expect(baseElement).toMatchSnapshot();
    });
});
