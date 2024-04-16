import { Box, LinearProgress } from "@mui/material";
import { FC, useEffect, useState } from "react";

const SLOW_UPDATE_MS = 1000; // if the response takes longer than 1000ms, it is considered slow and the full progress bar is shown

const LoadingDot: FC<{
    isLoading: boolean;
    noMargin?: boolean;
    slowUpdateMs?: number;
}> = ({ isLoading, noMargin = false, slowUpdateMs = SLOW_UPDATE_MS }) => {
    const [isSlow, setIsSlow] = useState(false);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | null = null;

        if (isLoading) {
            setIsSlow(false);
            timer = setTimeout(() => {
                setIsSlow(true);
            }, slowUpdateMs);
        }
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [isLoading, slowUpdateMs]);

    return (
        <Box
            sx={{
                height: 4,
                marginTop: noMargin ? "-12px" : "auto",
                marginBottom: noMargin ? "12px" : "auto",
                marginLeft: noMargin ? "-16px" : "auto",
                marginRight: noMargin ? "-16px" : "auto",
            }}
        >
            {isLoading ? (
                <LinearProgress
                    variant="indeterminate"
                    style={{ width: isSlow ? "auto" : 4 }}
                />
            ) : null}
        </Box>
    );
};

export default LoadingDot;
