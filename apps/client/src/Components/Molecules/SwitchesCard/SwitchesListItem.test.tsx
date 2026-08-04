import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FC, ReactNode } from "react";
import { smartEntitiesApi } from "../../../Services/generated/smartEntitiesApi";
import { State } from "../../../Services/generated/smartEntitiesApiWithRetry";
import fetchMock, { enableFetchMocks } from "../../../test/mswFetchMock";
import { MockStoreProvider } from "../../../testHelpers";
import { SwitchesListItem } from "./SwitchesListItem";

enableFetchMocks();

const Wrapper: FC<{ children: ReactNode }> = ({ children }) => (
    <MockStoreProvider apis={[smartEntitiesApi]}>{children}</MockStoreProvider>
);

describe("SwitchesListItem", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        fetchMock.mockResponse(JSON.stringify({}));
    });

    it("renders on/off buttons for a switch entity and updates state on click", async () => {
        const item: State = {
            entity_id: "switch.living_room",
            state: "off",
            attributes: { friendly_name: "Living room switch" },
        };
        render(<SwitchesListItem item={item} />, { wrapper: Wrapper });

        expect(screen.getByText("Living room switch")).toBeVisible();
        expect(screen.queryByRole("slider")).not.toBeInTheDocument();

        const [onButton] = screen.getAllByRole("button");
        fireEvent.click(onButton);

        await waitFor(() => expect(fetchMock.mock.calls).toHaveLength(1));
        const request = fetchMock.mock.calls[0][0] as Request;
        expect(request.url).toContain("/api/smart-entities/switch.living_room");
        expect(await request.json()).toEqual({ state: "on" });
    });

    it("renders a slider for a cover entity and updates position on commit", async () => {
        const item: State = {
            entity_id: "cover.bedroom_blind",
            state: "open",
            attributes: {
                friendly_name: "Bedroom blind",
                current_position: 40,
            },
        };
        render(<SwitchesListItem item={item} />, { wrapper: Wrapper });

        expect(screen.getByText("Bedroom blind")).toBeVisible();
        const slider = screen.getByRole("slider");
        expect(slider).toHaveAttribute("aria-valuenow", "40");

        slider.focus();
        fireEvent.keyDown(slider, { key: "ArrowRight" });

        await waitFor(() => expect(fetchMock.mock.calls).toHaveLength(1));
        const request = fetchMock.mock.calls[0][0] as Request;
        expect(request.url).toContain(
            "/api/smart-entities/cover.bedroom_blind"
        );
        expect(await request.json()).toEqual({ position: 41 });
    });
});
