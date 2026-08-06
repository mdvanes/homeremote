import {
    Box,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { FC } from "react";
import { useGetCaddyInfoQuery } from "../../../Services/generated/caddyInfoApiWithRetry";
import { usePolledQuery } from "../../../Utils/usePolledQuery";
import { staleContentSx } from "../../Molecules/CardStatus/CardStatus";
import CardStatusBar from "../../Molecules/CardStatusBar/CardStatusBar";
import ErrorRetry from "../../Molecules/ErrorRetry/ErrorRetry";

const UPDATE_INTERVAL_MS = 60 * 1000;

const Caddy: FC = () => {
    const {
        data,
        isLoading,
        isFetching,
        isError,
        isStale,
        lastUpdated,
        retry,
    } = usePolledQuery(useGetCaddyInfoQuery, undefined, {
        name: "Caddy",
        pollingInterval: UPDATE_INTERVAL_MS,
    });

    return (
        <Card sx={{ position: "relative" }}>
            <CardContent>
                <CardStatusBar
                    isLoading={(isLoading || isFetching) && !isError}
                    name="Caddy"
                    isError={isError}
                    isStale={isStale}
                    retry={retry}
                    lastUpdated={lastUpdated}
                />
                <Box sx={staleContentSx(isStale)}>
                    {data && !data.reachable && (
                        <ErrorRetry retry={() => retry()}>
                            Caddy admin API is unreachable
                        </ErrorRetry>
                    )}
                    {data?.reachable && (
                        <>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                TLS automation:{" "}
                                {data.tlsAutomationEnabled
                                    ? "enabled"
                                    : "disabled"}
                            </Typography>
                            <Table sx={{ mb: 3 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>server</TableCell>
                                        <TableCell>listen</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(data.servers ?? []).map((server) => (
                                        <TableRow key={server.name}>
                                            <TableCell>{server.name}</TableCell>
                                            <TableCell>
                                                {server.listen.join(", ")}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Domain routing
                            </Typography>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>domain</TableCell>
                                        <TableCell>destination</TableCell>
                                        <TableCell>server</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(data.servers ?? []).flatMap((server) =>
                                        server.routes.map((route) => (
                                            <TableRow
                                                key={`${server.name}-${route.domains.join(",")}`}
                                            >
                                                <TableCell>
                                                    {route.domains.join(", ")}
                                                </TableCell>
                                                <TableCell>
                                                    {route.upstreams.length > 0
                                                        ? route.upstreams.join(
                                                              ", "
                                                          )
                                                        : "—"}
                                                </TableCell>
                                                <TableCell>
                                                    {server.name}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default Caddy;
