import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()(() => ({
    car: {
        display: "flex",
        alignItems: "stretch",
        borderRadius: "4px",
        gap: 1,
        height: 40,
        "& .segment": {
            backgroundColor: "grey",
            flex: 1,
            // height: "20px",
            width: "20px",
        },
        "& .segment.locked": {
            backgroundColor: "green",
        },
        "& .segment.hood": {
            borderTopLeftRadius: "15px 8px",
            borderBottomLeftRadius: "15px 8px",
        },
        "& .segment.tailGate": {
            borderTopRightRadius: "4px",
            borderBottomRightRadius: "4px",
        },
    },
    container: {
        display: "flex",
        flexDirection: "column",
        gap: 1,
    },
}));

export default useStyles;
