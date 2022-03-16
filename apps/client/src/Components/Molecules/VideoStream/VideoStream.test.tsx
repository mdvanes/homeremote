import React from "react";
import { render, waitFor } from "@testing-library/react";
import VideoStream from "./VideoStream";
import fetchMock, { enableFetchMocks } from "jest-fetch-mock";

enableFetchMocks();

describe("VideoStream", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        fetchMock.mockResponse("http://someurl");
    });

    it("renders with stream url", async () => {
        const { baseElement } = render(<VideoStream />);
        await waitFor(() => {
            return expect(baseElement.querySelector("iframe")).toHaveAttribute(
                "src",
                "http://someurl"
            );
        });
        // screen.debug();
        expect(baseElement).toMatchSnapshot();
    });
});
