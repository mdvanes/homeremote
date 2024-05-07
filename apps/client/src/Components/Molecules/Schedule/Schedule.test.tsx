import { GetScheduleResponse, ScheduleItem } from "@homeremote/types";
import { render, screen } from "@testing-library/react";
import fetchMock, { enableFetchMocks } from "jest-fetch-mock";
import { FC, ReactNode } from "react";
import { scheduleApi } from "../../../Services/scheduleApi";
import { MockStoreProvider } from "../../../testHelpers";
import Schedule from "./Schedule";

enableFetchMocks();

const Wrapper: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <MockStoreProvider apis={[scheduleApi]}>{children}</MockStoreProvider>
    );
};

const mockScheduleResponse: GetScheduleResponse = {
    data: {
        later: [],
        missed: [
            {
                airdate: "2022-10-01",
                ep_name: "some missed name",
                airs: "",
                episode: 1,
                season: 3,
                show_status: "OK",
                show_name: "Missed",
            } as ScheduleItem,
        ],
        snatched: [],
        soon: [
            {
                airdate: "2022-11-07",
                ep_name: "some soon name",
                airs: "",
                episode: 3,
                season: 2,
                show_status: "OK",
                show_name: "Soon",
            } as ScheduleItem,
        ],
        today: [],
    },
    message: "",
    result: "success",
};

describe("Schedule", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        fetchMock.mockResponse(JSON.stringify(mockScheduleResponse));
    });

    it("shows different kinds of items", async () => {
        render(<Schedule />, { wrapper: Wrapper });
        await screen.findByText(/some soon name/);

        const listItemElems = screen.getAllByRole("listitem");
        expect(listItemElems[0]).toHaveTextContent(
            '2022-10-01 Missed 3x1 "some missed name"'
        );
        expect(listItemElems[1]).toHaveTextContent(
            '2022-11-07 Soon 2x3 "some soon name"'
        );
    });
});
