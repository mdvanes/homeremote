import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CardStatusBar from "./CardStatusBar";

describe("CardStatusBar", () => {
    const baseProps = {
        name: "Switches",
        retry: () => undefined,
    };

    it("shows the loading progress bar while loading", () => {
        render(
            <CardStatusBar
                {...baseProps}
                isLoading
                isError={false}
                isStale={false}
            />
        );

        expect(screen.getByRole("progressbar")).toBeVisible();
    });

    it("shows the stale bar (not the loading bar) when stale", () => {
        render(
            <CardStatusBar {...baseProps} isLoading={false} isError isStale />
        );

        expect(
            screen.getByRole("status", {
                name: "Switches is offline, reconnecting…",
            })
        ).toBeVisible();
        expect(screen.queryByRole("progressbar")).toBeNull();
    });

    it("shows the cold failure banner on a cold error", () => {
        render(
            <CardStatusBar
                {...baseProps}
                isLoading={false}
                isError
                isStale={false}
            />
        );

        expect(screen.getByText("Switches could not load")).toBeVisible();
        expect(screen.queryByRole("progressbar")).toBeNull();
    });

    it("renders no status indicator while healthy and idle", () => {
        render(
            <CardStatusBar
                {...baseProps}
                isLoading={false}
                isError={false}
                isStale={false}
            />
        );

        expect(screen.queryByRole("progressbar")).toBeNull();
        expect(screen.queryByRole("status")).toBeNull();
        expect(screen.queryByText(/could not load/)).toBeNull();
    });

    it("retries from the cold failure banner", async () => {
        const retry = vi.fn();
        render(
            <CardStatusBar
                name="Switches"
                retry={retry}
                isLoading={false}
                isError
                isStale={false}
            />
        );

        await userEvent.click(screen.getByRole("button"));

        expect(retry).toHaveBeenCalledTimes(1);
    });

    it("retries from the stale popover", async () => {
        const retry = vi.fn();
        render(
            <CardStatusBar
                name="Switches"
                retry={retry}
                isLoading={false}
                isError
                isStale
            />
        );

        await userEvent.hover(screen.getByRole("status"));

        const retryButton = await screen.findByRole("button", {
            name: "Retry",
        });
        await userEvent.click(retryButton);

        await waitFor(() => expect(retry).toHaveBeenCalledTimes(1));
    });
});
