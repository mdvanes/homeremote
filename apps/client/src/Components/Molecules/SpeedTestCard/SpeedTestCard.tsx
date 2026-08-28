import SpeedIcon from "@mui/icons-material/Speed";
import {
    Box,
    Card,
    CardContent,
    Fab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import { FC } from "react";
import { useGetSpeedtestQuery } from "../../../Services/generated/speedTestApiWithRetry";
import { usePolledQuery } from "../../../Utils/usePolledQuery";
import { staleContentSx } from "../CardStatus/CardStatus";
import CardStatusBar from "../CardStatusBar/CardStatusBar";

const FORMAT_DEFAULT_LOCALE = "nl-NL";

const FORMAT_DATE = new Intl.DateTimeFormat(FORMAT_DEFAULT_LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
});

const BASE_URL = "http://192.168.0.8:8089";

const UPDATE_INTERVAL_MS = 1_000 * 60 * 5; // 1x per 5 minutes

export const SpeedTestCard: FC = () => {
    const {
        data: speedTestResult,
        isLoading,
        isFetching,
        isError,
        isStale,
        lastUpdated,
        retry,
    } = usePolledQuery(useGetSpeedtestQuery, undefined, {
        name: "SpeedTest",
        pollingInterval: UPDATE_INTERVAL_MS,
    });

    const hasData = Boolean(speedTestResult && speedTestResult.data);

    return (
        <Card>
            <CardContent sx={{ position: "relative" }}>
                <CardStatusBar
                    isLoading={(isLoading || isFetching) && !isError}
                    name="SpeedTest"
                    isError={isError}
                    isStale={isStale}
                    retry={retry}
                    lastUpdated={lastUpdated}
                />
                {hasData && speedTestResult?.data && (
                    <Box sx={staleContentSx(isStale)}>
                        <Table sx={{ marginBottom: 3 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>down</TableCell>
                                    <TableCell>up</TableCell>
                                    <TableCell>ping</TableCell>
                                    <TableCell>timestamp</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow
                                    hover
                                    onClick={() => window.open(BASE_URL)}
                                    title="Open speedtest-tracker"
                                    style={{ cursor: "pointer" }}
                                >
                                    <TableCell>
                                        {Math.round(
                                            speedTestResult.data.download ?? 0
                                        )}
                                        Mbps
                                    </TableCell>
                                    <TableCell>
                                        {Math.round(
                                            speedTestResult.data.upload ?? 0
                                        )}
                                        Mbps
                                    </TableCell>
                                    <TableCell>
                                        {Math.round(
                                            speedTestResult.data.ping ?? 0
                                        )}
                                        ms
                                    </TableCell>
                                    <TableCell>
                                        {FORMAT_DATE.format(
                                            new Date(
                                                speedTestResult.data
                                                    .updated_at ?? 0
                                            )
                                        )}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Fab
                            color="primary"
                            aria-label="speed"
                            size="small"
                            onClick={() => retry()}
                            title="Get latest speedtest result"
                            sx={{
                                position: "absolute",
                                bottom: 16,
                                right: 16,
                            }}
                        >
                            <SpeedIcon />
                        </Fab>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default SpeedTestCard;
