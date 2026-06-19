import { render, screen } from "@testing-library/react";
import fetchMock, { enableFetchMocks } from "../../../test/mswFetchMock";
import VideoStream from "./VideoStream";

enableFetchMocks();

describe("VideoStream", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        fetchMock.mockResponse("http://someurl");
    });

    it("renders with stream url", async () => {
        render(<VideoStream />);
        const msg = await screen.findByText("VideoStream failed to load");
        expect(msg).toBeVisible();
    });
});
