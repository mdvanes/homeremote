import { MonitService } from "@homeremote/types";
import { Alert, Card, CardContent, Typography } from "@mui/material";
import { FC } from "react";
import { useGetMonitStatusQuery } from "../../../Services/monitApi";
import { getErrorMessage } from "../../../Utils/getErrorMessage";
import LoadingDot from "../LoadingDot/LoadingDot";

const formatDuration = (s: number) => {
    const daysDecimal = s / 60 / 60 / 24;
    const days = Math.floor(daysDecimal);
    const hoursDecimal = (daysDecimal - days) * 24;
    const hours = Math.floor(hoursDecimal);
    const minutesDecimal = (hoursDecimal - hours) * 60;
    const minutes = Math.floor(minutesDecimal);
    // Monit only updates once per minute on the backend
    // const secondsDecimal = (minutesDecimal - minutes) * 60;
    // const seconds = Math.floor(secondsDecimal);
    return `${days}d ${hours}h ${minutes}m`;
};

// Monit only updates once per minute on the backend
const UPDATE_INTERVAL_MS = 60 * 1000;

interface MonitFilesystemService extends Omit<MonitService, "block" | "port"> {
    block: NonNullable<MonitService["block"]>;
}

interface MonitHostService extends Omit<MonitService, "block" | "port"> {
    port: NonNullable<MonitService["port"]>;
}

// const foo: MonitHostService = {
//     name: "a",
//     status: 1,
//     status_hint: 1,
//     port: {
//         portnumber: 1,
//         protocol: "a",
//     },
// };

const isFilesystemService = (
    service: MonitService
): service is MonitFilesystemService =>
    typeof service.block?.total !== "undefined";

const isHostService = (service: MonitService): service is MonitHostService =>
    typeof service.port?.portnumber !== "undefined";

const Monit: FC = () => {
    const { data, isLoading, isFetching, error } = useGetMonitStatusQuery(
        undefined,
        {
            pollingInterval: UPDATE_INTERVAL_MS,
        }
    );

    if (error) {
        return <Alert severity="error">{getErrorMessage(error)}</Alert>;
    }

    const loadProgress = isLoading || isFetching ? <LoadingDot /> : " ";

    return (
        <Card>
            <CardContent>
                {loadProgress}
                {data?.monitlist.map((monit) => {
                    const services: MonitService[] = monit.services.slice();
                    services.sort((service, otherService) => {
                        // console.log(service.name, otherService.name);
                        if (service.name < otherService.name) {
                            return -1;
                        }
                        if (service.name > otherService.name) {
                            return 1;
                        }
                        return 0;
                    });
                    const filesystems = services.filter(isFilesystemService);
                    const hosts = services.filter(isHostService);
                    const other = services.filter(
                        (x) => !isHostService(x) && !isFilesystemService(x)
                    );
                    return (
                        <>
                            <Typography variant="h5">
                                {monit.localhostname}
                            </Typography>
                            <Typography variant="subtitle2">
                                uptime: {formatDuration(monit.uptime)}
                            </Typography>
                            <Typography>Other</Typography>
                            {other.map((n) => (
                                <Alert
                                    severity={
                                        n.status === 0 ? "success" : "error"
                                    }
                                    sx={{ marginBottom: "2px" }}
                                >
                                    {n.name}
                                </Alert>
                            ))}
                            <Typography>Filesystem</Typography>
                            {filesystems.map((n) => (
                                <Alert
                                    severity={
                                        n.status === 0 ? "success" : "error"
                                    }
                                    sx={{ marginBottom: "2px" }}
                                >
                                    {n.name} {n.block?.percent}%{" "}
                                    {n.block?.usage}/{n.block?.total}
                                </Alert>
                            ))}
                            <Typography>Host</Typography>
                            {hosts.map((n) => (
                                <Alert
                                    severity={
                                        n.status === 0 ? "success" : "error"
                                    }
                                    sx={{ marginBottom: "2px" }}
                                >
                                    {n.name} [{n.port.protocol}]{" "}
                                    {n.port.portnumber}
                                </Alert>
                            ))}
                        </>
                    );
                })}
            </CardContent>
        </Card>
    );
};

export default Monit;
