import { makeStyles } from "@mui/material";

const useStyles = makeStyles(() => ({
    page: {
        height: "calc(100vh - 80px)",
        overflow: "clip",
    },
    card: {
        aspectRatio: "16/9",
        marginTop: 10,
        overflow: "clip",
    },
    map: {
        height: "100%",
        position: "relative",
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
