import { ServiceHealth } from "@homeremote/types";
import { Box } from "@mui/material";
import { FC } from "react";

export const healthColor: Record<ServiceHealth, string> = {
    running: "success.main",
    degraded: "warning.main",
    stopped: "error.main",
};

interface HealthDotProps {
    health: ServiceHealth;
    size?: number;
    title?: string;
}

export const HealthDot: FC<HealthDotProps> = ({ health, size = 8, title }) => (
    <Box
        component="span"
        title={title}
        data-testid="health-dot"
        sx={{
            display: "inline-block",
            width: size,
            height: size,
            borderRadius: "50%",
            flexShrink: 0,
            backgroundColor: healthColor[health],
        }}
    />
);

export default HealthDot;
