import { SvgIcon } from "@mui/material";
import { ReactNode } from "react";
import { ReactComponent as PortainerIconRaw } from "./icons/docker.svg";
import { ReactComponent as JellyfinIconRaw } from "./icons/jellyfin.svg";
import { ReactComponent as PiHoleIconRaw } from "./icons/pi-hole.svg";
import { ReactComponent as SubsonicIconRaw } from "./icons/subsonic.svg";

export const customIconMap: Record<string, ReactNode> = {
    jellyfin: <SvgIcon component={JellyfinIconRaw} viewBox="0 0 512 512" />,
    subsonic: <SvgIcon component={SubsonicIconRaw} viewBox="0 0 64 64" />,
    pihole: <SvgIcon component={PiHoleIconRaw} viewBox="0 0 24 24" />,
    portainer: <SvgIcon component={PortainerIconRaw} viewBox="0 0 48 48" />,
};
