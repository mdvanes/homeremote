import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    map: {
        position: "relative",
        "& .leaflet-container": {
            height: "400px",
        },
        "& .custom-controls": {
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 1000,
            padding: "1rem",
            "& button": {
                textTransform: "uppercase",
                padding: "0.5rem",
                marginLeft: "0.5rem",
                fontWeight: "bold",
            },
        },
    },
}));

export default useStyles;
