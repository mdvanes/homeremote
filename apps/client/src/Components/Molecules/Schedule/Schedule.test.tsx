import { GetScheduleResponse } from "@homeremote/types";
import { render, screen } from "@testing-library/react";
import { FC, ReactNode } from "react";
import { scheduleApi } from "../../../Services/scheduleApi";
import fetchMock, { enableFetchMocks } from "../../../test/mswFetchMock";
import { MockStoreProvider } from "../../../testHelpers";
import Schedule from "./Schedule";

enableFetchMocks();

const Wrapper: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <MockStoreProvider apis={[scheduleApi]}>{children}</MockStoreProvider>
    );
};

const mockScheduleResponse: GetScheduleResponse = {
    items: [
        {
            id: "tvshow-1",
            kind: "tvshow",
            date: "2022-10-01",
            title: "Missed",
            posterUrl: null,
            detailUrl: "http://tvshow-url/series/missed",
            monitored: true,
            hasFile: false,
            seasonNumber: 3,
            episodeNumber: 1,
            episodeTitle: "some missed name",
        },
        {
            id: "movie-1",
            kind: "movie",
            date: "2022-11-07",
            title: "Some Movie",
            posterUrl: null,
            detailUrl: "http://movie-url/movie/some-movie",
            monitored: true,
            hasFile: true,
        },
    ],
};

describe("Schedule", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        fetchMock.mockResponse(JSON.stringify(mockScheduleResponse));
    });

    it("groups items by day and shows different kinds", async () => {
        render(<Schedule />, { wrapper: Wrapper });
        await screen.findByText(/Some Movie/);

        expect(screen.getByText("2022-10-01")).toBeInTheDocument();
        expect(screen.getByText("2022-11-07")).toBeInTheDocument();

        const listItemElems = screen.getAllByRole("listitem");
        expect(listItemElems[0]).toHaveTextContent(
            'Missed — 3x1 "some missed name"'
        );
        expect(listItemElems[1]).toHaveTextContent("Some Movie");

        const links = screen.getAllByRole("link");
        expect(links[0]).toHaveAttribute(
            "href",
            "http://tvshow-url/series/missed"
        );
        expect(links[0]).toHaveAttribute("target", "_blank");
        expect(links[1]).toHaveAttribute(
            "href",
            "http://movie-url/movie/some-movie"
        );
    });

    it("renders nothing when there are no items", async () => {
        fetchMock.mockResponse(JSON.stringify({ items: [] }));
        const { container } = render(<Schedule />, { wrapper: Wrapper });
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(container).toBeEmptyDOMElement();
    });
});
