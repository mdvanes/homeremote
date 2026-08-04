import { ScheduleItem } from "@homeremote/types";
import {
    Avatar,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import { FC } from "react";

const formatDayLabel = (date: string): string => {
    const toDateString = (d: Date): string => d.toISOString().slice(0, 10);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date === toDateString(today)) return "Today";
    if (date === toDateString(yesterday)) return "Yesterday";
    if (date === toDateString(tomorrow)) return "Tomorrow";
    return date;
};

// yyyy-mm-dd strings sort lexicographically the same as chronologically
const getDateColor = (date: string): string | undefined => {
    const todayStr = new Date().toISOString().slice(0, 10);
    if (date < todayStr) return "error.main";
    if (date === todayStr) return "warning.main";
    return undefined;
};

export const ScheduleListItem: FC<{ item: ScheduleItem }> = ({ item }) => {
    const { kind, title, posterUrl, detailUrl, hasFile, monitored, date } =
        item;
    const primary =
        kind === "tvshow"
            ? `${title} — ${item.seasonNumber}x${item.episodeNumber} "${item.episodeTitle}"`
            : title;

    const content = (
        <>
            {posterUrl && (
                <ListItemAvatar>
                    <Avatar
                        variant="square"
                        alt={title}
                        src={`${process.env.NX_PUBLIC_BASE_URL}${posterUrl}`}
                    />
                </ListItemAvatar>
            )}
            <ListItemText
                primary={primary}
                secondary={formatDayLabel(date)}
                sx={{
                    opacity: monitored ? 1 : 0.5,
                    color: hasFile ? "success.main" : "text.primary",
                }}
                slotProps={{
                    secondary: { sx: { color: getDateColor(date) } },
                }}
            />
        </>
    );

    return (
        <ListItem
            disablePadding={Boolean(detailUrl)}
            title={`${title} | ${kind}`}
        >
            {detailUrl ? (
                <ListItemButton
                    component="a"
                    href={detailUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {content}
                </ListItemButton>
            ) : (
                content
            )}
        </ListItem>
    );
};
