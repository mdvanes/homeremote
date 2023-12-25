import React from "react";
import { render, screen } from "@testing-library/react";
import VideoStream from "./VideoStream";
import fetchMock, { enableFetchMocks } from "jest-fetch-mock";

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
