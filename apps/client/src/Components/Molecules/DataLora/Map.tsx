import { FC } from "react";
import { MapContainer } from "react-leaflet";
import useStyles from "./Map.styles";
import MapContent from "./MapContent";
import { useLocQuery } from "./useLocQuery";

const Map: FC = () => {
    const { classes } = useStyles();
    const { coords, update, isLoading, toggleQueryType, queryType } =
        useLocQuery();

    return (
        <div className={classes.map}>
            <MapContainer zoom={20}>
                <MapContent coords={coords} />
            </MapContainer>
            <div className="custom-controls">
                <button onClick={() => update()} disabled={isLoading}>
                    update
                </button>
                <button onClick={toggleQueryType} disabled={isLoading}>
                    {queryType}
                </button>
            </div>
        </div>
    );
};

export default Map;
