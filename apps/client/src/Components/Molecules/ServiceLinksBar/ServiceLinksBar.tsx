import { FC } from "react";
import { Theme, useMediaQuery } from "@material-ui/core";

import { makeStyles } from "@material-ui/core";

import { ServiceLink } from "./ServiceLink";

const useStyles = makeStyles(() => ({
    contained: {
        backgroundColor: "white",
    },
    spacedBetween: {
        display: "flex",
        justifyContent: "space-between",
    },
}));

const ServiceLinksBar: FC = () => {
    const classNames = useStyles();
    const isBig = useMediaQuery<Theme>((theme) => theme.breakpoints.up("md"));
    return (
        <div className={isBig ? classNames.spacedBetween : ""}>
            <ServiceLink
                url="http://192.168.0.8"
                label="Pi-Hole"
                iconName="pihole"
            />
        </div>
    );
};

export default ServiceLinksBar;
