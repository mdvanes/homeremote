import { Box, IconButton, SxProps, Theme, Tooltip } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { FC } from "react";
import ErrorRetry from "../ErrorRetry/ErrorRetry";

interface CardStatusProps {
    /** Human readable card name, e.g. "Switches". */
    name: string;
    /** True when the latest poll failed. */
    isError: boolean;
    /** True when previously loaded data is shown but the latest poll failed. */
    isStale: boolean;
    /** Reset backoff and refetch immediately. */
    retry: () => void;
    /** Epoch ms of the last successful load, shown in the stale tooltip. */
    lastUpdated?: number;
    noMargin?: boolean;
}

/**
 * Formats an epoch timestamp as a partial ISO 8601 string in **local** time,
 * e.g. `2026-06-20T22:51`. Local (not UTC) so it matches the user's clock.
 */
export const formatPartialIso8601 = (timestamp: number): string => {
    const date = new Date(timestamp);
    const pad = (value: number): string => String(value).padStart(2, "0");
    return (
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
        `T${pad(date.getHours())}:${pad(date.getMinutes())}`
    );
};

/**
 * Consistent status indicator for polled cards.
 *
 * - Healthy: renders nothing.
 * - Stale (data still shown but the latest poll failed): a compact amber line,
 *   as thin as the loading bar so the card does not resize. Hovering reveals a
 *   popover with the "reconnecting" message, the timestamp of the last
 *   successful load, and a retry button.
 * - Cold failure (no data to show): a red "could not load" banner.
 */
export const CardStatus: FC<CardStatusProps> = ({
    name,
    isError,
    isStale,
    retry,
    lastUpdated,
    noMargin = false,
}) => {
    if (!isError) {
        return null;
    }

    if (isStale) {
        const reconnecting = `${name} is offline, reconnecting…`;
        const staleSince =
            lastUpdated !== undefined
                ? `Showing stale data from ${formatPartialIso8601(lastUpdated)}`
                : undefined;

        return (
            <Tooltip
                title={
                    <Box
                        sx={{
                            alignItems: "center",
                            display: "flex",
                            gap: 1,
                        }}
                    >
                        <Box>
                            <Box>{reconnecting}</Box>
                            {staleSince && (
                                <Box sx={{ opacity: 0.8 }}>{staleSince}</Box>
                            )}
                        </Box>
                        <Tooltip title="Retry">
                            <IconButton
                                size="small"
                                onClick={retry}
                                aria-label="Retry"
                                sx={{ color: "inherit" }}
                            >
                                <RestartAltIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                }
            >
                <Box
                    role="status"
                    aria-label={reconnecting}
                    sx={{
                        height: 4,
                        bgcolor: "warning.main",
                        cursor: "help",
                        // Overlay the reserved LoadingDot slot (which sits just
                        // above) so the stale bar appears in the exact same
                        // place as the blue progress bar instead of below it.
                        ...(noMargin
                            ? { mt: "-16px", mb: "12px", mx: "-16px" }
                            : { mt: "-4px" }),
                    }}
                />
            </Tooltip>
        );
    }

    return (
        <ErrorRetry noMargin={noMargin} retry={retry} severity="error">
            {`${name} could not load`}
        </ErrorRetry>
    );
};

/**
 * Style helper to visually dim a card's content while it is showing stale data,
 * making it obvious the data is not live without hiding it.
 */
export const staleContentSx = (isStale: boolean): SxProps<Theme> => ({
    opacity: isStale ? 0.5 : 1,
    transition: "opacity 0.2s ease-in-out",
});

export default CardStatus;
