import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()(({ palette }) => ({
    root: {
        color: palette.primary.light,
        "&:hover": {
            color: palette.background.paper,
            backgroundColor: palette.primary.light,
        },
    },
    active: {
        backgroundColor: `${palette.primary.light} !important`,
        color: palette.background.paper,
    },
}));

export default useStyles;
