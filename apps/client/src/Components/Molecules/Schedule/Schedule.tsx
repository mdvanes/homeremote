import { useGetScheduleQuery } from "../../../Services/scheduleApi";
import { FC, ReactNode } from "react";
import { List, ListItem, Paper } from "@mui/material";
import { ScheduleItem } from "@homeremote/types";
import LoadingDot from "../LoadingDot/LoadingDot";

// This barely updates once a day, so check once per hour
const UPDATE_INTERVAL_MS = 60 * 60 * 1000;

type ScheduleItemType = "missed" | "snatched" | "today" | "soon" | "later";

const typeToColor: Record<ScheduleItemType, string> = {
    missed: "error.light",
    snatched: "success.light",
    today: "info.light",
    soon: "text.primary",
    later: "text.secondary",
};

const scheduleItemToListItem =
    (type: ScheduleItemType) =>
    ({
        airdate,
        show_name,
        show_status,
        episode,
        season,
        ep_name,
    }: ScheduleItem): ReactNode =>
        (
            <ListItem
                key={`${show_name}-${season}x${episode}`}
                title={`${show_name} = ${show_status} | ${type}`}
                sx={{
                    color: typeToColor[type],
                }}
            >
                {airdate}&nbsp; <strong>{show_name}</strong>&nbsp; {season}x
                {episode} "{ep_name}"
            </ListItem>
        );

const Schedule: FC = () => {
    const { data, isLoading, isFetching } = useGetScheduleQuery(undefined, {
        pollingInterval: UPDATE_INTERVAL_MS,
    });

    if (!data) {
        return null;
    }

    const {
        data: { soon, today, later, missed, snatched },
    } = data;

    const combined = [...soon, ...today, ...later, ...missed, ...snatched];
    if (combined.length <= 0) {
        return null;
    }

    return (
        <List component={Paper}>
            <LoadingDot isLoading={isLoading || isFetching} />
            {missed.map(scheduleItemToListItem("missed"))}
            {snatched.map(scheduleItemToListItem("snatched"))}
            {today.map(scheduleItemToListItem("today"))}
            {soon.map(scheduleItemToListItem("soon"))}
            {later.map(scheduleItemToListItem("later"))}
        </List>
    );
};

export default Schedule;
