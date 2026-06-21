import { Box, List, Paper } from "@mui/material";
import { FC } from "react";
import { useGetSmartEntitiesQuery } from "../../../Services/generated/smartEntitiesApiWithRetry";
import { usePolledQuery } from "../../../Utils/usePolledQuery";
import CardStatus, { staleContentSx } from "../CardStatus/CardStatus";
import LoadingDot from "../LoadingDot/LoadingDot";
import { isClimateSensor, sortClimateSensors } from "../SwitchesCard/utils";
import { ClimateSensorsListItem } from "./ClimateSensorsListItem";

const UPDATE_INTERVAL_MS = 1_000 * 60 * 1.5; // 1000 ms / 60 seconds = 1x per 1.5 minutes (to prevent synching with SwitchesCard)

export const ClimateSensorsCard: FC = () => {
    const {
        data,
        isError,
        isFetching,
        isLoading,
        isStale,
        lastUpdated,
        retry,
    } = usePolledQuery(useGetSmartEntitiesQuery, undefined, {
        name: "Climate sensors",
        pollingInterval: UPDATE_INTERVAL_MS,
    });

    const climateSensors = (data?.entities ?? [])
        .filter(isClimateSensor)
        .toSorted(sortClimateSensors);

    return (
        <List component={Paper} onClick={() => retry()}>
            <LoadingDot
                isLoading={(isLoading || isFetching) && !isError}
                slowUpdateMs={4_000}
            />
            <CardStatus
                name="Climate sensors"
                isError={isError}
                isStale={isStale}
                retry={retry}
                lastUpdated={lastUpdated}
            />
            <Box sx={staleContentSx(isStale)}>
                <ClimateSensorsListItem sensors={climateSensors} />
            </Box>
        </List>
    );
};

export default ClimateSensorsCard;
