import { FC } from "react";
import { Theme, useMediaQuery } from "@mui/material";
import { ServiceLink } from "./ServiceLink";
import { useGetServiceLinksQuery } from "../../../Services/serviceLinksApi";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()(() => ({
    contained: {
        backgroundColor: "white",
    },
    spacedBetween: {
        display: "flex",
        justifyContent: "space-between",
    },
}));

const ServiceLinksBar: FC = () => {
    const { classes: classNames } = useStyles();
    const isBig = useMediaQuery<Theme>((theme) => theme.breakpoints.up("md"));
    const { data } = useGetServiceLinksQuery();

    return (
        <div className={isBig ? classNames.spacedBetween : ""}>
            {data &&
                data.status === "received" &&
                data.servicelinks.map(({ url, label, icon }) => (
                    <ServiceLink
                        key={label}
                        url={url}
                        label={label}
                        iconName={icon}
                    />
                ))}
        </div>
    );
};

export default ServiceLinksBar;
