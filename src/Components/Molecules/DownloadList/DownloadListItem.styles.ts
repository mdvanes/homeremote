import { makeStyles, lighten } from "@material-ui/core";

const useStyles = makeStyles(({ palette }) => ({
    root: {
        "&:hover": {
            backgroundColor: lighten(palette.primary.light, 0.8),
        },
    },
    main: {
        flexGrow: 1,
    },
    name: {
        fontWeight: "bold",
        wordBreak: "break-word",
    },
}));

export default useStyles;
