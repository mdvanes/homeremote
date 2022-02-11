import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(({ palette }) => ({
    root: {
        backgroundColor: palette.primary.dark,
        maxWidth: "120px",
        maxHeight: "2.5rem",
        "&:hover": {
            backgroundColor: palette.primary.light,
        },
    },
    label: {
        fontSize: "80%",
    },
}));

export default useStyles;
