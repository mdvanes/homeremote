import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()(() => ({
    page: {
        height: "calc(100vh - 80px)",
        overflow: "clip",
    },
    card: {
        aspectRatio: "16/9",
        overflow: "clip",
    },
    map: {
        height: "100%",
        position: "relative",
        "& .leaflet-container": {
            height: "100%",
        },
        "& .map-controls": {
            display: "flex",
            flexDirection: "column",
            "& button": {
                width: "30px",
                height: "30px",
                padding: 0,
                border: 0,
                borderBottom: "1px solid #ccc",
                backgroundColor: "#fff",
                color: "#000",
                cursor: "pointer",
                fontWeight: "bold",
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                    backgroundColor: "#f4f4f4",
                },
                "&:last-of-type": {
                    borderBottom: 0,
                },
            },
        },
        "& .marker-zoom-button": {
            marginTop: "0.5rem",
            padding: "0.35rem 0.5rem",
            border: "1px solid #aaa",
            borderRadius: "3px",
            backgroundColor: "#fff",
            cursor: "pointer",
            fontWeight: "bold",
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
    chart: {
        zIndex: 1000,
        position: "absolute",
        bottom: 0,
        left: 0,
    },
}));

export default useStyles;
