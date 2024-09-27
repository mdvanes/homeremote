import SpeedIcon from "@mui/icons-material/Speed";
import {
    Card,
    CardContent,
    Fab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import { FC, useEffect } from "react";
import { useGetSpeedtestQuery } from "../../../Services/generated/speedTestApiWithRetry";
import { getErrorMessage } from "../../../Utils/getErrorMessage";
import { useAppDispatch } from "../../../store";
import ErrorRetry from "../ErrorRetry/ErrorRetry";
import LoadingDot from "../LoadingDot/LoadingDot";
import { logError } from "../LogCard/logSlice";

const FORMAT_DEFAULT_LOCALE = "nl-NL";

const FORMAT_DATE = new Intl.DateTimeFormat(FORMAT_DEFAULT_LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
});

const BASE_URL = "http://192.168.0.8:8089";

export const SpeedTestCard: FC = () => {
    const dispatch = useAppDispatch();
    const {
        data: speedTestResult,
        refetch,
        isLoading,
        isFetching,
        isError,
        error,
    } = useGetSpeedtestQuery();

    useEffect(() => {
        if (isError && error) {
            dispatch(
                logError(`SpeedTestCard failed: ${getErrorMessage(error)}`)
            );
        }
    }, [dispatch, error, isError]);

    const isErrorOrEmpty = isError || !speedTestResult || !speedTestResult.data;

    return (
        <Card>
            <CardContent sx={{ position: "relative" }}>
                <LoadingDot isLoading={isLoading || isFetching} />
                {isErrorOrEmpty && (
                    <ErrorRetry retry={() => refetch()}>
                        SwitchesCard could not load
                    </ErrorRetry>
                )}
                {!isErrorOrEmpty && speedTestResult.data && (
                    <>
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
                            onClick={() => refetch()}
                            title="Get latest speedtest result"
                            sx={{
                                position: "absolute",
                                bottom: 16,
                                right: 16,
                            }}
                        >
                            <SpeedIcon />
                        </Fab>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default SpeedTestCard;
