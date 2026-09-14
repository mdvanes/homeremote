import { TrackerItem } from "@homeremote/types";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { DomEvent, Icon, IconOptions, polygon } from "leaflet";
import { FC, useCallback, useEffect, useMemo, useRef } from "react";
import { Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";

const DEFAULT_BOUNDS = polygon([
    [52, 4],
    [52, 6],
]).getBounds();

// const TILES_LAYER_DEFAULT =
//     "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
// const TILES_LAYER_BW = "https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png";
// Source: https://leaflet-extras.github.io/leaflet-providers/preview/
const TILES_LAYER_DARK =
    "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png";
// alternative: https://api.maptiler.com/maps/streets-v4-dark/style.json?key=INSERT_YOUR_OWN_API_KEY

interface Props {
    coords: TrackerItem[][];
    activeMarkerTimestamp: string;
}

const LINE_COLORS = ["#3488ff", "green", "red", "yellow", "purple"] as const;

const baseIconProps: IconOptions = {
    iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
};

const blueIcon = new Icon(baseIconProps);

const greenIcon = new Icon({
    ...baseIconProps,
    iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
});

const MARKER_ICONS = [blueIcon, greenIcon];

const hasValidCoords = (item: TrackerItem): item is TrackerItem =>
    item.loc.length > 1 &&
    typeof item.loc[0] === "number" &&
    typeof item.loc[1] === "number";

const getBounds = (coords: TrackerItem[][]) => {
    const locations = coords.flatMap((deviceCoords) =>
        deviceCoords.filter(hasValidCoords).map(({ loc }) => loc)
    );

    return locations.length > 0
        ? polygon(locations).getBounds()
        : DEFAULT_BOUNDS;
};

interface MapControlsProps {
    onReset: () => void;
}

const MapControls: FC<MapControlsProps> = ({ onReset }) => {
    const map = useMap();
    const controlRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (controlRef.current) {
            DomEvent.disableClickPropagation(controlRef.current);
            DomEvent.disableScrollPropagation(controlRef.current);
        }
    }, []);

    return (
        <div className="leaflet-top leaflet-left">
            <div
                ref={controlRef}
                className="leaflet-control leaflet-bar map-controls"
            >
                <button
                    type="button"
                    aria-label="Zoom in"
                    title="Zoom in"
                    onClick={() => map.zoomIn()}
                >
                    +
                </button>
                <button
                    type="button"
                    aria-label="Zoom out"
                    title="Zoom out"
                    onClick={() => map.zoomOut()}
                >
                    -
                </button>
                <button
                    type="button"
                    aria-label="Reset map view"
                    title="Reset map view"
                    onClick={onReset}
                >
                    <RestartAltIcon fontSize="small" />
                </button>
            </div>
        </div>
    );
};

const MapContent: FC<Props> = ({ coords, activeMarkerTimestamp }) => {
    const map = useMap();
    const hasFitInitialData = useRef(false);
    const hasSetDefaultView = useRef(false);

    const resetMapView = useCallback(() => {
        map.fitBounds(getBounds(coords));
    }, [coords, map]);

    useEffect(() => {
        const hasData = coords.some((deviceCoords) =>
            deviceCoords.some(hasValidCoords)
        );

        if (hasData && !hasFitInitialData.current) {
            resetMapView();
            hasFitInitialData.current = true;
        } else if (
            !hasData &&
            !hasSetDefaultView.current &&
            !hasFitInitialData.current
        ) {
            map.fitBounds(DEFAULT_BOUNDS);
            hasSetDefaultView.current = true;
        }
    }, [coords, map, resetMapView]);

    const markers = useMemo(() => {
        const latestMarkers = coords
            .map((deviceCoords) => deviceCoords.at(-1))
            .filter((item) => item !== undefined) as TrackerItem[];
        const firstMarker = latestMarkers[0];
        const activeCoord = coords[0]?.find(
            (item) => item.time === activeMarkerTimestamp
        );

        if (!firstMarker || !activeCoord) {
            return latestMarkers;
        }

        return [
            {
                ...firstMarker,
                loc: activeCoord.loc,
            },
            ...latestMarkers.slice(1),
        ];
    }, [activeMarkerTimestamp, coords]);

    return (
        <>
            <MapControls onReset={resetMapView} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url={TILES_LAYER_DARK}
            />
            {coords.map((deviceCoords, i) => {
                return (
                    <Polyline
                        key={i}
                        color={LINE_COLORS[i]}
                        positions={deviceCoords
                            .filter(hasValidCoords)
                            .map((deviceCoord) => deviceCoord.loc)}
                    />
                );
            })}
            {markers.filter(hasValidCoords).map((marker, i) => (
                <Marker key={i} position={marker.loc} icon={MARKER_ICONS[i]}>
                    <Popup>
                        <div>{marker.name}</div>
                        <div>
                            {new Date(marker.time).toLocaleString("nl-nl")}
                        </div>
                        <button
                            type="button"
                            className="marker-zoom-button"
                            aria-label={`Zoom in on ${marker.name}`}
                            onClick={() => {
                                map.setView(marker.loc, map.getMaxZoom(), {
                                    animate: true,
                                });
                                map.closePopup();
                            }}
                        >
                            Zoom in
                        </button>
                    </Popup>
                </Marker>
            ))}
        </>
    );
};

export default MapContent;
