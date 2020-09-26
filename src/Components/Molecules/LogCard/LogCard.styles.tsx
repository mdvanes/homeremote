import { makeStyles, Theme, StyleRules, createStyles } from "@material-ui/core";

const useStyles = makeStyles(
    ({ typography }: Theme): StyleRules =>
        createStyles({
            version: {
                paddingBottom: 0,
                "& p": {
                    fontSize: typography.fontSize * 0.7,
                },
            },
        })
);

export default useStyles;
