import { Box, List, Paper } from "@mui/material";
import { FC } from "react";
import { useGetSmartEntitiesQuery } from "../../../Services/generated/smartEntitiesApiWithRetry";
import { usePolledQuery } from "../../../Utils/usePolledQuery";
import CardStatus, { staleContentSx } from "../CardStatus/CardStatus";
import LoadingDot from "../LoadingDot/LoadingDot";
import { SwitchesListItem } from "./SwitchesListItem";
import { isSwitch } from "./utils";

const UPDATE_INTERVAL_MS = 1_000 * 60; // 1000 ms / 60 seconds = 1x per minute

export const SwitchesCard: FC = () => {
    const {
        data,
        isError,
        isFetching,
        isLoading,
        isStale,
        lastUpdated,
        retry,
    } = usePolledQuery(useGetSmartEntitiesQuery, undefined, {
        name: "Switches",
        pollingInterval: UPDATE_INTERVAL_MS,
    });

    const switches = (data?.entities ?? []).filter(isSwitch);

    return (
        <List component={Paper}>
            <LoadingDot
                isLoading={isLoading || isFetching}
                slowUpdateMs={4_000}
            />
            <CardStatus
                name="Switches"
                isError={isError}
                isStale={isStale}
                retry={retry}
                lastUpdated={lastUpdated}
            />
            <Box sx={staleContentSx(isStale)}>
                {switches.map((item) => (
                    <SwitchesListItem key={item.entity_id} item={item} />
                ))}
            </Box>
        </List>
    );
};

export default SwitchesCard;
