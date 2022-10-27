import {
    MonitFilesystemService,
    MonitHostService,
    MonitItem,
    MonitService,
} from "@homeremote/types";
import { Alert, Typography } from "@mui/material";
import { FC } from "react";
import { formatDuration, sortByName } from "./monit-utils";
import MonitHostServiceInstance from "./MonitHostServiceInstance";

const isFilesystemService = (
    service: MonitService
): service is MonitFilesystemService =>
    typeof service.block?.total !== "undefined";

const isHostService = (service: MonitService): service is MonitHostService =>
    typeof service.port?.portnumber !== "undefined";

// TODO prop read only
const MonitInstance: FC<{
    monit: MonitItem;
}> = ({ monit }) => {
    const services: MonitService[] = monit.services.slice();
    services.sort(sortByName);
    const filesystems = services.filter(isFilesystemService);
    const hosts = services.filter(isHostService);
    const other = services.filter(
        (x) => !isHostService(x) && !isFilesystemService(x)
    );
    return (
        <>
            <Typography variant="h5">{monit.localhostname}</Typography>
            <Typography variant="subtitle2">
                uptime: {formatDuration(monit.uptime)}
            </Typography>
            <Typography>Other</Typography>
            {other.map((n) => (
                <Alert
                    severity={n.status === 0 ? "success" : "error"}
                    sx={{ marginBottom: "2px" }}
                >
                    {n.name}
                </Alert>
            ))}
            <Typography>Filesystem</Typography>
            {filesystems.map((n) => (
                <Alert
                    severity={n.status === 0 ? "success" : "error"}
                    sx={{ marginBottom: "2px" }}
                >
                    {n.name} {n.block?.percent}% {n.block?.usage}/
                    {n.block?.total}
                </Alert>
            ))}
            <Typography>Host</Typography>
            {hosts.map((item) => (
                <MonitHostServiceInstance item={item} />
                // <Alert
                //     severity={n.status === 0 ? "success" : "error"}
                //     sx={{ marginBottom: "2px" }}
                // >
                //     {n.name} [{n.port.protocol}] {n.port.portnumber}
                // </Alert>
            ))}
        </>
    );
};

export default MonitInstance;
