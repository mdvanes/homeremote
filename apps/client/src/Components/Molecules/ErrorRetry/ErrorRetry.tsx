import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Alert, Box, IconButton, Tooltip } from "@mui/material";
import { FC, PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
    noMargin?: boolean;
    retry: () => void;
    severity?: "error" | "warning";
}

export const ErrorRetry: FC<Props> = ({
    noMargin = false,
    children,
    retry,
    severity = "error",
}) => {
    const message = <div>{children}</div>;
    return (
        <Box
            component={Alert}
            severity={severity}
            square
            sx={{
                mx: noMargin ? -2 : undefined,

                ".MuiAlert-message": {
                    width: "100%",
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                {message}
                <Tooltip title="Retry">
                    <IconButton
                        size="small"
                        onClick={retry}
                        sx={{
                            ".MuiSvgIcon-root": {
                                marginTop: "-0.5rem",
                            },
                        }}
                    >
                        <RestartAltIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default ErrorRetry;
