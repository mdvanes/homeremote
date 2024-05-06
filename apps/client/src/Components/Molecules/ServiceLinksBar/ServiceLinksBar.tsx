import { Theme, useMediaQuery } from "@mui/material";
import { FC } from "react";
import { makeStyles } from "tss-react/mui";
import { useGetServiceLinksQuery } from "../../../Services/serviceLinksApi";
import { ServiceLink } from "./ServiceLink";

const useStyles = makeStyles()(() => ({
    contained: {
        backgroundColor: "white",
    },
    spacedBetween: {
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
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
