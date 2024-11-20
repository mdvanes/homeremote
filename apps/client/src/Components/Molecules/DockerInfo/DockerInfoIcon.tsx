import { DockerContainerUIInfo } from "@homeremote/types";
import { Icon, SvgIcon } from "@mui/material";
import { lightBlue } from "@mui/material/colors";
import { FC, ReactNode } from "react";
import { ReactComponent as PortainerIconRaw } from "../ServiceLinksBar/icons/docker.svg";
import { ReactComponent as JellyfinIconRaw } from "../ServiceLinksBar/icons/jellyfin.svg";
import { ReactComponent as PiHoleIconRaw } from "../ServiceLinksBar/icons/pi-hole.svg";
import { ReactComponent as SubsonicIconRaw } from "../ServiceLinksBar/icons/subsonic.svg";

const customIconMap: Record<string, ReactNode> = {
    jellyfin: (
        <SvgIcon
            style={{ width: 22 }}
            component={JellyfinIconRaw}
            viewBox="0 0 512 512"
        />
    ),
    subsonic: (
        <SvgIcon
            style={{ width: 22 }}
            component={SubsonicIconRaw}
            viewBox="0 0 64 64"
        />
    ),
    pihole: (
        <SvgIcon
            style={{ width: 22 }}
            component={PiHoleIconRaw}
            viewBox="0 0 24 24"
        />
    ),
    portainer: (
        <SvgIcon
            style={{ width: 22 }}
            component={PortainerIconRaw}
            viewBox="0 0 48 48"
        />
    ),
};

export const DockerInfoIcon: FC<{ info: DockerContainerUIInfo }> = ({
    info,
}) => {
    const { Ports, url, icon } = info;

    const customIcon = customIconMap[icon ?? ""];
    const iconName = icon ?? "launch";

    if (!Ports || !((Ports ?? []).length > 0)) {
        return null;
    }

    return (
        <a
            href={url}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
                color: lightBlue[400],
            }}
        >
            {customIcon ? (
                customIcon
            ) : (
                <Icon
                    sx={{
                        fontSize: "22px !important",
                    }}
                >
                    {iconName}
                </Icon>
            )}
        </a>
    );
};
