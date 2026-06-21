import { Box, Card, CardContent } from "@mui/material";
import { FC } from "react";
import { useGetMonitStatusQuery } from "../../../Services/monitApi";
import { usePolledQuery } from "../../../Utils/usePolledQuery";
import { staleContentSx } from "../CardStatus/CardStatus";
import CardStatusBar from "../CardStatusBar/CardStatusBar";
import MonitInstance from "./MonitInstance";

// Monit only updates once per minute on the backend
const UPDATE_INTERVAL_MS = 60 * 1000;

const Monit: FC = () => {
    const {
        data,
        isLoading,
        isFetching,
        isError,
        isStale,
        lastUpdated,
        retry,
    } = usePolledQuery(useGetMonitStatusQuery, undefined, {
        name: "Monit",
        pollingInterval: UPDATE_INTERVAL_MS,
    });

    return (
        <Card sx={{ position: "relative" }}>
            <CardContent>
                <CardStatusBar
                    isLoading={(isLoading || isFetching) && !isError}
                    name="Monit"
                    isError={isError}
                    isStale={isStale}
                    retry={retry}
                    lastUpdated={lastUpdated}
                />
                <Box sx={staleContentSx(isStale)}>
                    {data?.monitlist.map((monit) => (
                        <MonitInstance
                            monit={monit}
                            key={monit.localhostname}
                        />
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
};

export default Monit;
