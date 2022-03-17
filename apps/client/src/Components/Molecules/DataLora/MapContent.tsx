import { polygon } from "leaflet";
import { FC, useCallback, useEffect, useState } from "react";
import { TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { TrackerItem } from "@homeremote/types";

// const DEFAULT_CENTER: LatLngTuple = [52, 5.1];

// const TILES_LAYER_DEFAULT =
//     "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
// const TILES_LAYER_BW = "https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png";
// Source: https://leaflet-extras.github.io/leaflet-providers/preview/
const TILES_LAYER_DARK =
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

interface Props {
    coords: TrackerItem[];
}

const MapContent: FC<Props> = ({ coords }) => {
    const [marker, setMarker] = useState<TrackerItem | null>(null);
    const map = useMap();

    const updateBoundsAndMarker = useCallback(() => {
        if (coords.length > 0) {
            const newPoly = polygon(coords.map(({ loc }) => loc));
            map.fitBounds(newPoly.getBounds());
            const last = coords[coords.length - 1];
            setMarker(last);
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
            <Polyline positions={coords.map((coord) => coord.loc)} />
            {marker && (
                <Marker position={marker.loc}>
                    <Popup>
                        {new Date(marker.time).toLocaleString("nl-nl")}
                    </Popup>
                </Marker>
            )}
        </>
    );
};

export default MapContent;
