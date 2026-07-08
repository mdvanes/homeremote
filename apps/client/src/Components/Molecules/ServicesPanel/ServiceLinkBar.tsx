import { ServiceLink } from "@homeremote/types";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, Chip } from "@mui/material";
import { FC } from "react";

const MAX_VISIBLE = 8;

interface ServiceLinkBarProps {
    links: ServiceLink[];
}

export const ServiceLinkBar: FC<ServiceLinkBarProps> = ({ links }) => {
    if (links.length === 0) {
        return null;
    }

    const visible = links.slice(0, MAX_VISIBLE);
    const moreCount = links.length - visible.length;

    return (
        <Box
            sx={{
                display: "flex",
                gap: 0.5,
                flexWrap: "nowrap",
                overflowX: "auto",
                alignItems: "center",
                paddingY: 0.5,
                // Keep the discovered links on a single horizontally scrollable line.
                "&::-webkit-scrollbar": { height: 4 },
            }}
        >
            {visible.map((link) => (
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
                    sx={{ flexShrink: 0 }}
                />
            ))}
            {moreCount > 0 && (
                <Box
                    sx={{
                        fontSize: 11,
                        color: "text.secondary",
                        flexShrink: 0,
                        paddingX: 0.5,
                    }}
                >
                    +{moreCount} more
                </Box>
            )}
        </Box>
    );
};

export default ServiceLinkBar;
