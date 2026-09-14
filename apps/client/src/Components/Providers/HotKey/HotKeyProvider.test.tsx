import { fireEvent, render, screen } from "@testing-library/react";
import { FC } from "react";
import HotKeyProvider, { useHotKeyContext } from "./HotKeyProvider";

const dispatchMock = vi.hoisted(() => vi.fn());

vi.mock("react-redux", () => ({
    useDispatch: () => dispatchMock,
}));

vi.mock("../../../Services/generated/nowplayingApi", () => ({
    useGetRadio2PreviouslyQuery: () => ({ data: undefined }),
}));

const NotificationState: FC = () => {
    const { hotKeyMap, songNotificationsEnabled } = useHotKeyContext();

    return (
        <>
            <span>{songNotificationsEnabled ? "enabled" : "disabled"}</span>
            <span>{hotKeyMap.n?.description}</span>
        </>
    );
};

describe("HotKeyProvider song notification shortcut", () => {
    beforeEach(() => {
        localStorage.clear();
        dispatchMock.mockClear();
    });

    it("toggles song notifications with the N key and shows a toast", () => {
        render(
            <HotKeyProvider>
                <NotificationState />
            </HotKeyProvider>
        );

        expect(screen.getByText("enabled")).toBeInTheDocument();
        expect(
            screen.getByText(
                "toggle song change notifications while music is playing"
            )
        ).toBeInTheDocument();

        fireEvent.keyDown(document, { key: "n" });

        expect(screen.getByText("disabled")).toBeInTheDocument();
        expect(localStorage.getItem("SONG_NOTIFICATIONS_ENABLED")).toBe(
            "false"
        );
        expect(dispatchMock).toHaveBeenCalledWith({
            type: "loglines/logUrgentInfo",
            payload: "Song change notifications disabled",
        });
    });
});
