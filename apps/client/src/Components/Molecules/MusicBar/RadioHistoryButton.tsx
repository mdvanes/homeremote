import { History as HistoryIcon } from "@mui/icons-material";
import {
    Avatar,
    Box,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListSubheader,
    Popover,
    Tooltip,
    useTheme,
} from "@mui/material";
import { FC, useState } from "react";
import { useGetRadio2PreviouslyQuery } from "../../../Services/generated/nowplayingApi";
import LoadingDot from "../LoadingDot/LoadingDot";

// Update every 3 minutes (also keeps the shared cache warm for skip detection).
const UPDATE_INTERVAL_MS = 3 * 60 * 1000;

type Track = NonNullable<
    ReturnType<typeof useGetRadio2PreviouslyQuery>["data"]
>[number];

// Group consecutive tracks by the hour they started, preserving order.
const groupByHour = (tracks: Track[]): { hour: string; tracks: Track[] }[] => {
    const groups: { hour: string; tracks: Track[] }[] = [];
    tracks.forEach((track) => {
        const hour = track.time?.start?.slice(11, 13) ?? "??";
        const label = `${hour}:00`;
        const last = groups[groups.length - 1];
        if (last && last.hour === label) {
            last.tracks.push(track);
        } else {
            groups.push({ hour: label, tracks: [track] });
        }
    });
    return groups;
};

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
                disableScrollLock
            >
                <Box sx={{ width: 360, maxHeight: 440, overflowY: "auto" }}>
                    <LoadingDot isLoading={isLoading || isFetching} />
                    <List subheader={<li />}>
                        {groupByHour(data ?? []).map((group) => (
                            <li key={group.hour}>
                                <ul style={{ padding: 0 }}>
                                    <ListSubheader>{group.hour}</ListSubheader>
                                    {group.tracks.map((track) => {
                                        const primary = `${track.artist} - ${track.title}`;
                                        const imageUrl =
                                            track?.songImageUrl ??
                                            track?.broadcast?.imageUrl;
                                        return (
                                            <ListItem key={track.time?.start}>
                                                <ListItemAvatar
                                                    sx={{
                                                        mr: 2,
                                                        minWidth: "auto",
                                                    }}
                                                >
                                                    <Avatar
                                                        variant="rounded"
                                                        src={imageUrl}
                                                        alt={
                                                            track.broadcast
                                                                ?.title
                                                        }
                                                        sx={{
                                                            width: 56,
                                                            height: 56,
                                                        }}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        track.listenUrl ? (
                                                            <a
                                                                style={{
                                                                    color: palette
                                                                        .text
                                                                        .primary,
                                                                }}
                                                                href={
                                                                    track.listenUrl
                                                                }
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
                                                    )}: ${
                                                        track.broadcast?.title
                                                    } / ${
                                                        track.broadcast
                                                            ?.presenters
                                                    }`}
                                                />
                                            </ListItem>
                                        );
                                    })}
                                </ul>
                            </li>
                        ))}
                    </List>
                </Box>
            </Popover>
        </>
    );
};

export default RadioHistoryButton;
