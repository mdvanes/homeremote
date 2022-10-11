import { FC, ReactNode } from "react";
import {
    Icon,
    IconButton,
    ListItemIcon,
    MenuItem,
    SvgIcon,
    Theme,
    Tooltip,
    Typography,
    useMediaQuery,
} from "@mui/material";

import { makeStyles } from "@mui/material";
import { ReactComponent as PortainerIconRaw } from "./icons/docker.svg";
import { ReactComponent as PiHoleIconRaw } from "./icons/pi-hole.svg";
import { ReactComponent as SubsonicIconRaw } from "./icons/subsonic.svg";
import { ReactComponent as JellyfinIconRaw } from "./icons/jellyfin.svg";

const useStyles = makeStyles(() => ({
    icon: {
        color: "black",
    },
}));

const customIconMap: Record<string, ReactNode> = {
    jellyfin: <SvgIcon component={JellyfinIconRaw} viewBox="0 0 512 512" />,
    subsonic: <SvgIcon component={SubsonicIconRaw} viewBox="0 0 64 64" />,
    pihole: <SvgIcon component={PiHoleIconRaw} viewBox="0 0 24 24" />,
    portainer: <SvgIcon component={PortainerIconRaw} viewBox="0 0 48 48" />,
};

interface Props {
    label: string;
    iconName: string;
    url: string;
}

export const ServiceLink: FC<Props> = ({ label, iconName, url, children }) => {
    const buttonClasses = useStyles();
    const customIcon = customIconMap[iconName];
    const isBig = useMediaQuery<Theme>((theme) => theme.breakpoints.up("md"));
    const iconResult = (
        <>{children || customIcon || <Icon>{iconName}</Icon>} </>
    );
    return (
        <Tooltip title={label} aria-label={label.toLowerCase()}>
            {isBig ? (
                <IconButton
                    className={buttonClasses.icon}
                    component="a"
                    href={url}
                >
                    {iconResult}
                </IconButton>
            ) : (
                <MenuItem component="a" href={url}>
                    <ListItemIcon className={buttonClasses.icon}>
                        {iconResult}
                    </ListItemIcon>
                    <Typography>{label}</Typography>
                </MenuItem>
            )}
        </Tooltip>
    );
};
