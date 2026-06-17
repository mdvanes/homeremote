import { render, screen } from "@testing-library/react";
import NowPlayingSourceImage from "./NowPlayingSourceImage";

describe("NowPlayingSourceImage", () => {
    it("defaults to showing the radio source", () => {
        render(<NowPlayingSourceImage />);
        expect(screen.getByText("Radio")).toBeInTheDocument();
    });
});
