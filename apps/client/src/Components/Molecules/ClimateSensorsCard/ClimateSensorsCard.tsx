import { Box, List, Paper } from "@mui/material";
import { FC } from "react";
import { useGetSmartEntitiesQuery } from "../../../Services/generated/smartEntitiesApiWithRetry";
import { usePolledQuery } from "../../../Utils/usePolledQuery";
import { staleContentSx } from "../CardStatus/CardStatus";
import CardStatusBar from "../CardStatusBar/CardStatusBar";
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
        <List
            component={Paper}
            onClick={() => retry()}
            sx={{ position: "relative" }}
        >
            <CardStatusBar
                isLoading={(isLoading || isFetching) && !isError}
                name="Climate sensors"
                isError={isError}
                isStale={isStale}
                retry={retry}
                lastUpdated={lastUpdated}
                slowUpdateMs={4_000}
            />
            <Box sx={staleContentSx(isStale)}>
                <ClimateSensorsListItem sensors={climateSensors} />
            </Box>
        </List>
    );
};

export default ClimateSensorsCard;
