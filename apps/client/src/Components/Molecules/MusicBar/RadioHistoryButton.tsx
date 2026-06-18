import { History as HistoryIcon } from "@mui/icons-material";
import {
    Avatar,
    Box,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Popover,
    Tooltip,
    useTheme,
} from "@mui/material";
import { FC, useState } from "react";
import { useGetRadio2PreviouslyQuery } from "../../../Services/generated/nowplayingApi";
import LoadingDot from "../LoadingDot/LoadingDot";

// Update every 3 minutes (also keeps the shared cache warm for skip detection).
const UPDATE_INTERVAL_MS = 3 * 60 * 1000;

/**
 * Compact "previously played on radio" history: a single icon button that opens
 * a popover with the recent tracks, instead of an always-visible list.
 */
const RadioHistoryButton: FC = () => {
    const { palette } = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const { data, isLoading, isFetching } = useGetRadio2PreviouslyQuery(
        undefined,
        {
            pollingInterval: UPDATE_INTERVAL_MS,
        }
    );

    return (
        <>
            <Tooltip title="Previously played on radio">
                <IconButton
                    aria-label="Previously played on radio"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                    <HistoryIcon />
                </IconButton>
            </Tooltip>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Box sx={{ width: 360, maxHeight: 440, overflowY: "auto" }}>
                    <LoadingDot isLoading={isLoading || isFetching} />
                    <List>
                        {data?.map((track) => {
                            const primary = `${track.artist} - ${track.title}`;
                            const imageUrl =
                                track?.songImageUrl ??
                                track?.broadcast?.imageUrl;
                            return (
                                <ListItem key={track.time?.start}>
                                    <ListItemAvatar>
                                        <Avatar
                                            variant="rounded"
                                            src={imageUrl}
                                            alt={track.broadcast?.title}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            track.listenUrl ? (
                                                <a
                                                    style={{
                                                        color: palette.text
                                                            .primary,
                                                    }}
                                                    href={track.listenUrl}
                                                >
                                                    {primary}
                                                </a>
                                            ) : (
                                                primary
                                            )
                                        }
                                        secondary={`${track.time?.start?.slice(
                                            11,
                                            16
                                        )}: ${track.broadcast?.title} / ${
                                            track.broadcast?.presenters
                                        }`}
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                </Box>
            </Popover>
        </>
    );
};

export default RadioHistoryButton;
