import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()(() => ({
    car: {
        display: "flex",
        alignItems: "stretch",
        borderRadius: "4px",
        gap: 1,
        height: 40,
        "& .segment, & .tyre": {
            backgroundColor: "grey",
            flex: 1,
            width: "20px",
        },
        "& .segment.locked": {
            backgroundColor: "green",
        },
        "& .segment.unlocked": {
            backgroundColor: "red",
        },
        "& .segment.hood": {
            borderTopLeftRadius: "15px 8px",
            borderBottomLeftRadius: "15px 8px",
        },
        "& .segment.tailGate": {
            borderTopRightRadius: "4px",
            borderBottomRightRadius: "4px",
        },
        "& .tyre.ok": {
            backgroundColor: "black",
        },
        "& .tyre.warn": {
            backgroundColor: "yellow",
        },
    },
    container: {
        display: "flex",
        flexDirection: "column",
        gap: 1,
    },
}));

export default useStyles;
