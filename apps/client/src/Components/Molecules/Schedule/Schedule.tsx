import { ScheduleItem } from "@homeremote/types";
import { Box, List, ListSubheader, Paper } from "@mui/material";
import { FC, Fragment, useState } from "react";
import { useGetScheduleQuery } from "../../../Services/scheduleApi";
import { usePolledQuery } from "../../../Utils/usePolledQuery";
import CardExpandBar from "../CardExpandBar/CardExpandBar";
import { staleContentSx } from "../CardStatus/CardStatus";
import CardStatusBar from "../CardStatusBar/CardStatusBar";
import { ScheduleListItem } from "./ScheduleListItem";

// This barely updates once a day, so check once per hour
const UPDATE_INTERVAL_MS = 60 * 60 * 1000;

const CUTOFF = 5;

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

const groupByDate = (items: ScheduleItem[]): [string, ScheduleItem[]][] => {
    const groups: [string, ScheduleItem[]][] = [];
    items.forEach((item) => {
        const lastGroup = groups[groups.length - 1];
        if (lastGroup && lastGroup[0] === item.date) {
            lastGroup[1].push(item);
        } else {
            groups.push([item.date, [item]]);
        }
    });
    return groups;
};

const Schedule: FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {
        data,
        isLoading,
        isFetching,
        isError,
        isStale,
        lastUpdated,
        retry,
    } = usePolledQuery(useGetScheduleQuery, undefined, {
        name: "Schedule",
        pollingInterval: UPDATE_INTERVAL_MS,
    });

    if (!data || data.items.length <= 0) {
        return null;
    }

    const items = isOpen ? data.items : data.items.slice(0, CUTOFF);
    const groups = groupByDate(items);

    return (
        <List component={Paper} sx={{ position: "relative" }}>
            <CardStatusBar
                isLoading={isLoading || isFetching}
                name="Schedule"
                isError={isError}
                isStale={isStale}
                retry={retry}
                lastUpdated={lastUpdated}
            />
            <Box sx={staleContentSx(isStale)}>
                {groups.map(([date, dateItems]) => (
                    <Fragment key={date}>
                        <ListSubheader component="div">
                            {formatDayLabel(date)}
                        </ListSubheader>
                        {dateItems.map((item) => (
                            <ScheduleListItem key={item.id} item={item} />
                        ))}
                    </Fragment>
                ))}
                {data.items.length > CUTOFF && (
                    <CardExpandBar
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        hint={`and ${data.items.length - CUTOFF} more`}
                    />
                )}
            </Box>
        </List>
    );
};

export default Schedule;
