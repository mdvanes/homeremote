import { makeStyles, Theme, StyleRules, createStyles } from "@material-ui/core";

const useStyles = makeStyles(
    ({ typography }: Theme): StyleRules =>
        createStyles({
            root: {
                height: "100vh",
                maxHeight: "435px",
                display: "flex",
                flexDirection: "column",
            },
            content: {
                flex: 1,
                overflowX: "auto",
                "& p": {
                    fontSize: typography.fontSize * 0.8,
                },
            },
            version: {
                paddingBottom: 0,
                "& p": {
                    fontSize: typography.fontSize * 0.7,
                },
            },
        })
);

export default useStyles;
