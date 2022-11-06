import {
    MonitFilesystemService,
    MonitHostService,
    MonitItem,
    MonitService,
} from "@homeremote/types";
import { Grid, Theme, Typography, useMediaQuery } from "@mui/material";
import { FC } from "react";
import { sortByName } from "./monit-utils";
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
    const isBig = useMediaQuery<Theme>((theme) => theme.breakpoints.up("md"));
    const xsFromMediaQuery = isBig ? true : 12;
    const services: MonitService[] = monit.services.slice();
    services.sort(sortByName);
    const filesystems = services.filter(isFilesystemService);
    const hosts = services.filter(isHostService);
    const hosts1 = hosts.slice(0, hosts.length / 2);
    const hosts2 = hosts.slice(hosts.length / 2);
    const other = services.filter(
        (service) => !isHostService(service) && !isFilesystemService(service)
    );
    return (
        <>
            <Typography variant="h5">{monit.localhostname}</Typography>
            <Typography variant="subtitle2">uptime: {monit.uptime}</Typography>

            <Grid container gap={0.5}>
                <Grid item xs={xsFromMediaQuery}>
                    <Typography>Other</Typography>
                    {other.map((item) => (
                        <MonitStatusAlert
                            key={item.name}
                            status={item.status}
                            name={item.name}
                        />
                    ))}
                </Grid>
                <Grid item xs={xsFromMediaQuery}>
                    <Typography>Filesystem</Typography>
                    {filesystems.map((item, index) => (
                        <MonitFilesystemServiceInstance
                            item={item}
                            key={index}
                        />
                    ))}
                </Grid>
            </Grid>

            <Typography>Host</Typography>
            <Grid container gap={0.5}>
                <Grid item xs={xsFromMediaQuery}>
                    {hosts1.map((item, index) => (
                        <MonitHostServiceInstance item={item} key={index} />
                    ))}
                </Grid>
                <Grid item xs={xsFromMediaQuery}>
                    {hosts2.map((item, index) => (
                        <MonitHostServiceInstance item={item} key={index} />
                    ))}
                </Grid>
            </Grid>
        </>
    );
};

export default MonitInstance;
