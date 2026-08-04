import { ServiceLink } from "@homeremote/types";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, Chip, Icon, IconButton, Tooltip } from "@mui/material";
import { FC } from "react";
import { customIconMap } from "../ServiceLinksBar/customIcons";

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
            {links.map((link) =>
                link.icon ? (
                    <Tooltip key={link.label} title={link.label}>
                        <IconButton
                            component="a"
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                            aria-label={link.label}
                        >
                            {customIconMap[link.icon] ?? (
                                <Icon fontSize="small">{link.icon}</Icon>
                            )}
                        </IconButton>
                    </Tooltip>
                ) : (
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
                )
            )}
        </Box>
    );
};

export default ServiceLinkBar;
