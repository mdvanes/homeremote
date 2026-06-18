import { Box, Typography } from "@mui/material";
import { FC } from "react";
import { useHotKeyContext } from "../../Providers/HotKey/HotKeyProvider";

/**
 * Shows the title, artist and album (radio station for radio) of whichever
 * source is currently active.
 */
const TrackInfo: FC = () => {
    const { currentSource, radioInfo, jukeboxInfo } = useHotKeyContext();
    const info = currentSource === "radio" ? radioInfo : jukeboxInfo;

    const hasInfo = info.title || info.artist || info.album;

    return (
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography variant="subtitle1" noWrap title={info.title}>
                {hasInfo ? info.title || "—" : "Nothing playing"}
            </Typography>
            <Typography
                variant="body2"
                color="text.secondary"
                noWrap
                title={info.artist}
            >
                {info.artist}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
                {info.album}
            </Typography>
        </Box>
    );
};

export default TrackInfo;
