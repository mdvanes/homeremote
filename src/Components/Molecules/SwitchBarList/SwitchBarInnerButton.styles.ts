import { makeStyles, Theme, createStyles, StyleRules } from "@material-ui/core";

const useStyles = makeStyles(
    (theme: Theme): StyleRules =>
        createStyles({
            root: {
                backgroundColor: (isActive: any): string =>
                    isActive
                        ? `${theme.palette.primary.light} !important`
                        : "transparent",
            },
        })
);

export default useStyles;
