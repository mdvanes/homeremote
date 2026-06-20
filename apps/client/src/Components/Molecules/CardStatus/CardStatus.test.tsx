import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CardStatus, { formatPartialIso8601 } from "./CardStatus";

describe("formatPartialIso8601", () => {
    it("formats a timestamp as local YYYY-MM-DDThh:mm", () => {
        // Build the expected value from the same local components so the test
        // is timezone independent.
        const date = new Date(2026, 5, 20, 22, 51); // 2026-06-20 22:51 local
        expect(formatPartialIso8601(date.getTime())).toBe("2026-06-20T22:51");
    });

    it("zero-pads single digit month, day, hour and minute", () => {
        const date = new Date(2026, 0, 5, 3, 9); // 2026-01-05 03:09 local
        expect(formatPartialIso8601(date.getTime())).toBe("2026-01-05T03:09");
    });
});

describe("CardStatus", () => {
    it("renders nothing while healthy", () => {
        const { container } = render(
            <CardStatus
                name="Switches"
                isError={false}
                isStale={false}
                retry={() => undefined}
            />
        );

        expect(container).toBeEmptyDOMElement();
    });

    it("shows a friendly reconnecting banner while data is stale", () => {
        render(
            <CardStatus
                name="Switches"
                isError
                isStale
                retry={() => undefined}
            />
        );

        expect(
            screen.getByText("Switches is offline, reconnecting…")
        ).toBeVisible();
    });

    it("shows a stale tooltip with the last updated timestamp", async () => {
        const date = new Date(2026, 5, 20, 22, 51);
        render(
            <CardStatus
                name="Switches"
                isError
                isStale
                retry={() => undefined}
                lastUpdated={date.getTime()}
            />
        );

        await userEvent.hover(
            screen.getByText("Switches is offline, reconnecting…")
        );

        await waitFor(() =>
            expect(
                screen.getByText("Showing stale data from 2026-06-20T22:51")
            ).toBeVisible()
        );
    });

    it("does not show a stale tooltip when there is no last updated time", async () => {
        render(
            <CardStatus
                name="Switches"
                isError
                isStale
                retry={() => undefined}
            />
        );

        await userEvent.hover(
            screen.getByText("Switches is offline, reconnecting…")
        );

        await new Promise((resolve) => setTimeout(resolve, 50));
        expect(screen.queryByText(/Showing stale data/)).toBeNull();
    });

    it("shows a could-not-load banner on a cold failure", () => {
        render(
            <CardStatus
                name="Switches"
                isError
                isStale={false}
                retry={() => undefined}
            />
        );

        expect(screen.getByText("Switches could not load")).toBeVisible();
    });

    it("calls retry when the retry button is clicked", async () => {
        const retry = vi.fn();
        render(
            <CardStatus name="Switches" isError isStale={false} retry={retry} />
        );

        await userEvent.click(screen.getByRole("button"));

        expect(retry).toHaveBeenCalledTimes(1);
    });
});
