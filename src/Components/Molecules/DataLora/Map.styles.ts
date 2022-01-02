import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    page: {
        height: "calc(100vh - 80px)",
        overflow: "clip",
    },
    card: {
        height: 300,
        overflow: "clip",
        marginTop: 10,
        // paddingTop: "50%",
        // position: "relative",
    },
    map: {
        position: "relative",
        // position: "absolute",
        // top: 0,
        height: "100%",
        "& .leaflet-container": {
            height: "100%",
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
