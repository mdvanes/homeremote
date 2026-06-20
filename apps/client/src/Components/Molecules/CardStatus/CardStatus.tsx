import { SxProps, Theme } from "@mui/material";
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
 * Consistent status banner for polled cards.
 *
 * - Healthy: renders nothing.
 * - Stale (data still shown but the latest poll failed): a friendly amber
 *   "reconnecting" banner, so the user knows the data may be out of date while
 *   the card keeps retrying in the background.
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

    const staleTooltip =
        isStale && lastUpdated !== undefined
            ? `Showing stale data from ${formatPartialIso8601(lastUpdated)}`
            : undefined;

    return (
        <ErrorRetry
            noMargin={noMargin}
            retry={retry}
            severity={isStale ? "warning" : "error"}
            tooltip={staleTooltip}
        >
            {isStale
                ? `${name} is offline, reconnecting…`
                : `${name} could not load`}
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
