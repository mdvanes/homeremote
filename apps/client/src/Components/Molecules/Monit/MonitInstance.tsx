import {
    MonitFilesystemService,
    MonitHostService,
    MonitItem,
    MonitService,
} from "@homeremote/types";
import { Typography } from "@mui/material";
import { FC } from "react";
import { formatDuration, sortByName } from "./monit-utils";
import MonitFilesystemServiceInstance from "./MonitFilesystemServiceInstance";
import MonitHostServiceInstance from "./MonitHostServiceInstance";
import MonitStatusAlert from "./MonitStatusAlert";

const isFilesystemService = (
    service: MonitService
): service is MonitFilesystemService =>
    typeof service.block?.total !== "undefined";

const isHostService = (service: MonitService): service is MonitHostService =>
    typeof service.port?.portnumber !== "undefined";

const MonitInstance: FC<{
    readonly monit: MonitItem;
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
            {other.map((item) => (
                <MonitStatusAlert status={item.status}>
                    {item.name}
                </MonitStatusAlert>
            ))}
            <Typography>Filesystem</Typography>
            {filesystems.map((item) => (
                <MonitFilesystemServiceInstance item={item} />
            ))}
            <Typography>Host</Typography>
            {hosts.map((item) => (
                <MonitHostServiceInstance item={item} />
            ))}
        </>
    );
};

export default MonitInstance;
