import { ServiceLink } from "@homeremote/types";
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

    // Icon links before plain links, stable within each group.
    const sortedLinks = [...links].sort(
        (a, b) => Number(!a.icon) - Number(!b.icon)
    );

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
            {sortedLinks.map((link) =>
                link.icon ? (
                    <Tooltip key={link.label} title={link.label}>
                        <IconButton
                            component="a"
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                            aria-label={link.label}
                            sx={{ color: "primary.main" }}
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
                        label={link.label}
                    />
                )
            )}
        </Box>
    );
};

export default ServiceLinkBar;
