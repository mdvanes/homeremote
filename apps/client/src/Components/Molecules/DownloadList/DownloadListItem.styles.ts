import { lighten } from "@mui/material";
import { makeStyles } from "tss-react/mui";

export const useListItemStyles = makeStyles()(({ palette }) => ({
    root: {
        "&:hover": {
            backgroundColor: lighten(palette.primary.light, 0.8),
        },
    },
}));

const useStyles = makeStyles()(({ palette }) => ({
    main: {
        flexGrow: 1,
    },
    name: {
        fontWeight: "bold",
        wordBreak: "break-word",
    },
}));

export default useStyles;
