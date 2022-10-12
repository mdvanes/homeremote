import { makeStyles } from "tss-react/mui";

export const useListItemStyles = makeStyles()(({ palette }) => ({
    root: {
        "&:hover": {
            backgroundColor: palette.background.paper,
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
