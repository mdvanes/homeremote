import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Alert, Box, IconButton, Tooltip } from "@mui/material";
import { FC, PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
    noMargin?: boolean;
    retry: () => void;
}

export const ErrorRetry: FC<Props> = ({
    noMargin = false,
    children,
    retry,
}) => {
    return (
        <Box
            mx={noMargin ? -2 : undefined}
            component={Alert}
            severity="error"
            square
            sx={{
                ".MuiAlert-message": {
                    width: "100%",
                },
            }}
        >
            <Box
                display="flex"
                flex={1}
                flexDirection="row"
                justifyContent="space-between"
            >
                <div>{children}</div>
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
