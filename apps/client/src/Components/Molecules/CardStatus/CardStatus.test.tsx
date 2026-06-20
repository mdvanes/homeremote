import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CardStatus from "./CardStatus";

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
