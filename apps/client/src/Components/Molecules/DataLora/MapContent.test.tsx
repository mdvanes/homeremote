import { TrackerItem } from "@homeremote/types";
import { fireEvent, render, screen } from "@testing-library/react";
import { ReactNode } from "react";
import MapContent from "./MapContent";

const mapMock = vi.hoisted(() => ({
    closePopup: vi.fn(),
    fitBounds: vi.fn(),
    getMaxZoom: vi.fn(() => 18),
    setView: vi.fn(),
    zoomIn: vi.fn(),
    zoomOut: vi.fn(),
}));

vi.mock("react-leaflet", () => ({
    Marker: ({
        children,
        position,
    }: {
        children: ReactNode;
        position: [number, number];
    }) => (
        <div data-testid="marker" data-position={JSON.stringify(position)}>
            {children}
        </div>
    ),
    Polyline: () => null,
    Popup: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    TileLayer: () => null,
    useMap: () => mapMock,
}));

const initialCoords: TrackerItem[][] = [
    [
        {
            loc: [52.1, 4.11],
            time: "2022-01-10T11:35:11.541Z",
            name: "Tracker",
        },
        {
            loc: [52.1, 4.31],
            time: "2022-01-10T11:40:11.541Z",
            name: "Tracker",
        },
    ],
];

describe("MapContent", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mapMock.getMaxZoom.mockReturnValue(18);
    });

    it("preserves the current view when new coordinates arrive", () => {
        const { rerender } = render(
            <MapContent coords={[]} activeMarkerTimestamp="" />
        );

        expect(mapMock.fitBounds).toHaveBeenCalledTimes(1);

        rerender(
            <MapContent coords={initialCoords} activeMarkerTimestamp="" />
        );

        expect(mapMock.fitBounds).toHaveBeenCalledTimes(2);

        rerender(
            <MapContent
                coords={[
                    [
                        ...initialCoords[0],
                        {
                            loc: [52.2, 4.41],
                            time: "2022-01-10T11:45:11.541Z",
                            name: "Tracker",
                        },
                    ],
                ]}
                activeMarkerTimestamp=""
            />
        );

        expect(mapMock.fitBounds).toHaveBeenCalledTimes(2);

        fireEvent.click(screen.getByRole("button", { name: "Reset map view" }));

        expect(mapMock.fitBounds).toHaveBeenCalledTimes(3);
    });

    it("provides zoom controls and can zoom directly to a marker", () => {
        render(<MapContent coords={initialCoords} activeMarkerTimestamp="" />);

        fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
        fireEvent.click(screen.getByRole("button", { name: "Zoom out" }));
        fireEvent.click(
            screen.getByRole("button", { name: "Zoom in on Tracker" })
        );

        expect(mapMock.zoomIn).toHaveBeenCalledOnce();
        expect(mapMock.zoomOut).toHaveBeenCalledOnce();
        expect(mapMock.setView).toHaveBeenCalledWith([52.1, 4.31], 18, {
            animate: true,
        });
        expect(mapMock.closePopup).toHaveBeenCalledOnce();
    });
});
