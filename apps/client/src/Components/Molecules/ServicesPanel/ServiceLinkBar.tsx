import { ServiceLink } from "@homeremote/types";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, Chip } from "@mui/material";
import { FC } from "react";

interface ServiceLinkBarProps {
    links: ServiceLink[];
}

export const ServiceLinkBar: FC<ServiceLinkBarProps> = ({ links }) => {
    if (links.length === 0) {
        return null;
    }

    return (
        <Box
            sx={{
                display: "flex",
                gap: 0.5,
                flexWrap: "wrap",
                alignItems: "center",
                paddingY: 0.5,
            }}
        >
            {links.map((link) => (
                <Chip
                    key={link.label}
                    component="a"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    clickable
                    size="small"
                    icon={<OpenInNewIcon />}
                    label={link.label}
                />
            ))}
        </Box>
    );
};

export default ServiceLinkBar;
