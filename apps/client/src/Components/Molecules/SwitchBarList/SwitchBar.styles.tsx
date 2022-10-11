import { makeStyles, Theme, StyleRules, createStyles } from "@mui/material";

const useStyles = makeStyles(
    ({ spacing, typography }: Theme): StyleRules =>
        createStyles({
            card: {
                marginBottom: spacing(1),
                "> div": {
                    paddingBottom: "0 !important",
                },
            },
            buttonGroup: {
                display: "flex",
                padding: "0 !important",
                alignItems: "center",
                "& button": {
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "0.7em 1.2em",
                    fontSize: typography.body1.fontSize,
                },
                "& .dummy": {
                    height: spacing(3),
                    width: spacing(3),
                },
            },
            label: {
                fontFamily: "Roboto",
                flex: 1,
                textAlign: "center",
                "& button": {
                    fontFamily: "Roboto",
                },
            },
        })
);

export default useStyles;
