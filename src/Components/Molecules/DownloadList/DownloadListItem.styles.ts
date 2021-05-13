import { makeStyles, lighten } from "@material-ui/core";

export const useListItemStyles = makeStyles(({ palette }) => ({
    root: {
        "&:hover": {
            backgroundColor: lighten(palette.primary.light, 0.8),
        },
    },
}));

const useStyles = makeStyles(({ palette }) => ({
    main: {
        flexGrow: 1,
    },
    name: {
        fontWeight: "bold",
        wordBreak: "break-word",
    },
}));

export default useStyles;
