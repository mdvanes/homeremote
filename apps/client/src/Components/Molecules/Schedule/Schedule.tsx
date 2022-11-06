import { useGetScheduleQuery } from "../../../Services/scheduleApi";
import { FC, ReactNode } from "react";
import { List, ListItem, Paper } from "@mui/material";
import { ScheduleItem } from "@homeremote/types";
import LoadingDot from "../LoadingDot/LoadingDot";

// This barely updates once a day, so check once per hour
const UPDATE_INTERVAL_MS = 60 * 60 * 1000;

const scheduleItemToListItem =
    (color: string) =>
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
                title={`${show_name} = ${show_status}`}
                sx={{
                    color,
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
            {missed.map(scheduleItemToListItem("error.light"))}
            {snatched.map(scheduleItemToListItem("success.light"))}
            {today.map(scheduleItemToListItem("info.light"))}
            {soon.map(scheduleItemToListItem("text.primary"))}
            {later.map(scheduleItemToListItem("text.secondary"))}
        </List>
    );
};

export default Schedule;
