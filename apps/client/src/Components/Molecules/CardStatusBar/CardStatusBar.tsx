import { Box } from "@mui/material";
import { FC } from "react";
import CardStatus from "../CardStatus/CardStatus";
import LoadingDot from "../LoadingDot/LoadingDot";

interface CardStatusBarProps {
    /** True while a (re)fetch is in flight and no error is shown. */
    isLoading: boolean;
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
    /** Delay before the loading dot expands into a full progress bar. */
    slowUpdateMs?: number;
}

/**
 * Combines the loading progress bar (`LoadingDot`) and the poll status indicator
 * (`CardStatus`) into a single element. The two are mutually exclusive in the UI
 * and are now guaranteed to render in the exact same place.
 *
 * The thin loading / stale bars are pinned flush to the **top edge** of the
 * parent card, span its full width and follow its border radius, so every card
 * gets a consistent, gap-free bar regardless of its container's padding.
 *
 * The parent card must be `position: relative` so the bar can anchor to its top
 * edge. The cold-failure banner keeps normal flow because it has real height.
 */
export const CardStatusBar: FC<CardStatusBarProps> = ({
    isLoading,
    name,
    isError,
    isStale,
    retry,
    lastUpdated,
    slowUpdateMs,
}) => {
    if (isError && !isStale) {
        return (
            <CardStatus
                name={name}
                isError={isError}
                isStale={false}
                retry={retry}
            />
        );
    }

    return (
        <Box
            sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1,
                overflow: "hidden",
                borderTopLeftRadius: "inherit",
                borderTopRightRadius: "inherit",
            }}
        >
            <LoadingDot isLoading={isLoading} slowUpdateMs={slowUpdateMs} />
            <CardStatus
                name={name}
                isError={isError}
                isStale={isStale}
                retry={retry}
                lastUpdated={lastUpdated}
            />
        </Box>
    );
};

export default CardStatusBar;
