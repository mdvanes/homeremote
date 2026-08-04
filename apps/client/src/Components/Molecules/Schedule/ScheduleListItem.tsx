import { ScheduleItem } from "@homeremote/types";
import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { FC } from "react";

export const ScheduleListItem: FC<{ item: ScheduleItem }> = ({ item }) => {
    const { kind, title, posterUrl, hasFile, monitored } = item;
    const primary =
        kind === "tvshow"
            ? `${title} — ${item.seasonNumber}x${item.episodeNumber} "${item.episodeTitle}"`
            : title;

    return (
        <ListItem title={`${title} | ${kind}`}>
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
                sx={{
                    opacity: monitored ? 1 : 0.5,
                    color: hasFile ? "success.main" : "text.primary",
                }}
            />
        </ListItem>
    );
};
