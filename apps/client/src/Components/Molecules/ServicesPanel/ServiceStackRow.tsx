import { ServiceStack } from "@homeremote/types";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, IconButton } from "@mui/material";
import { FC } from "react";
import { ContainerDots } from "./ContainerDots";
import { HealthDot } from "./HealthDot";
import { ServiceStackActions } from "./ServiceStackActions";

interface ServiceStackRowProps {
    stack: ServiceStack;
}

export const ServiceStackRow: FC<ServiceStackRowProps> = ({ stack }) => {
    const linkUrl = stack.link?.url;
    const isHealthy = stack.health === "running";

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                paddingX: 1,
                paddingY: 0.5,
                minHeight: 30,
                borderRadius: 1,
                "&:hover": { backgroundColor: "action.hover" },
                "&:hover .service-stack-actions": { opacity: 1 },
            }}
        >
            <HealthDot
                health={stack.health}
                title={`${stack.Name} · ${stack.health}`}
            />
            <Box
                sx={{
                    fontSize: 12,
                    fontWeight: 500,
                    minWidth: 84,
                    color: isHealthy ? "text.secondary" : "text.primary",
                    whiteSpace: "nowrap",
                }}
            >
                {stack.Name}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <ContainerDots containers={stack.containers} />
            </Box>
            {linkUrl ? (
                <IconButton
                    size="small"
                    component="a"
                    href={linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Open ${stack.Name}`}
                    aria-label={`Open ${stack.Name}`}
                    color="primary"
                >
                    <OpenInNewIcon fontSize="small" />
                </IconButton>
            ) : (
                <IconButton
                    size="small"
                    disabled
                    title="No link configured"
                    aria-label="No link configured"
                >
                    <OpenInNewIcon fontSize="small" />
                </IconButton>
            )}
            <ServiceStackActions
                stack={stack}
                className="service-stack-actions"
            />
        </Box>
    );
};

export default ServiceStackRow;
