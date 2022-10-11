import { makeStyles, Theme, createStyles, StyleRules } from "@mui/material";

// This should use generic styles on makeStyles or createStyles with Props to make it work without "any" type
// const useStyles = makeStyles(
//     (theme: Theme): StyleRules =>
//         createStyles({
//             root: {
//                 backgroundColor: (props: any): string =>
//                     props.isActive
//                         ? `${theme.palette.primary.light} !important`
//                         : "transparent",
//             },
//         })
// );

const useStyles = makeStyles(
    (theme: Theme): StyleRules =>
        createStyles({
            root: {
                "&:hover": {
                    backgroundColor: theme.palette.primary.light,
                },
            },
            active: {
                backgroundColor: `${theme.palette.primary.light} !important`,
            },
        })
);

export default useStyles;
