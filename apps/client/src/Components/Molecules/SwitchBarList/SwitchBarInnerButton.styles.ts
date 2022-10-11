import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme) => ({
    root: {
        "&:hover": {
            backgroundColor: theme.palette.primary.light,
        },
    },
    active: {
        backgroundColor: `${theme.palette.primary.light} !important`,
    },
}));

export default useStyles;
