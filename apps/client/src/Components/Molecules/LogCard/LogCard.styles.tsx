import { makeStyles, Theme, StyleRules, createStyles } from "@mui/material";

const useStyles = makeStyles(
    ({ typography }: Theme): StyleRules =>
        createStyles({
            root: {
                height: "100vh",
                maxHeight: "335px",
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
            message: {
                "& svg": {
                    transform: "translateY(3px)",
                    marginRight: "0.2rem",
                    height: "14px",
                    width: "14px",
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
