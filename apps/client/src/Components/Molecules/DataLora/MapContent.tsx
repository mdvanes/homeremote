import { TrackerItem } from "@homeremote/types";
import { Icon, IconOptions, polygon } from "leaflet";
import { FC, useCallback, useEffect, useState } from "react";
import { Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";

// const DEFAULT_CENTER: LatLngTuple = [52, 5.1];

// const TILES_LAYER_DEFAULT =
//     "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
// const TILES_LAYER_BW = "https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png";
// Source: https://leaflet-extras.github.io/leaflet-providers/preview/
const TILES_LAYER_DARK =
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

interface Props {
    coords: TrackerItem[][];
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

const MapContent: FC<Props> = ({ coords }) => {
    const [markers, setMarkers] = useState<TrackerItem[] | null>(null);
    const map = useMap();

    const updateBoundsAndMarker = useCallback(() => {
        const firstDeviceCoords = coords?.[0] ?? [];
        if (firstDeviceCoords.length > 0) {
            const newPoly = polygon(firstDeviceCoords.map(({ loc }) => loc));
            map.fitBounds(newPoly.getBounds());
            const last: TrackerItem[] = coords
                .map((deviceCoords) => deviceCoords.at(-1))
                .filter((item) => item !== undefined) as TrackerItem[];
            setMarkers(last);
        }
    }, [coords, map]);

    useEffect(() => {
        updateBoundsAndMarker();
    }, [coords, updateBoundsAndMarker]);

    return (
        <>
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
            {markers?.filter(hasValidCoords).map((marker, i) => (
                <Marker key={i} position={marker.loc} icon={MARKER_ICONS[i]}>
                    <Popup>
                        <div>{marker.name}</div>
                        <div>
                            {new Date(marker.time).toLocaleString("nl-nl")}
                        </div>
                    </Popup>
                </Marker>
            ))}
        </>
    );
};

export default MapContent;
