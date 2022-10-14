import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme) => ({
    root: {
        flexGrow: 1,
        marginBottom: theme.spacing(1),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    currentUser: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default useStyles;
