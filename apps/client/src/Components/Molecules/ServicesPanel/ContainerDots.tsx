import { ServiceContainer } from "@homeremote/types";
import { Box } from "@mui/material";
import { FC } from "react";
import { HealthDot } from "./HealthDot";

interface ContainerDotsProps {
    containers: ServiceContainer[];
}

export const ContainerDots: FC<ContainerDotsProps> = ({ containers }) => (
    <Box
        sx={{
            display: "flex",
            gap: 0.5,
            alignItems: "center",
            flexWrap: "wrap",
        }}
    >
        {containers.map((container) => (
            <HealthDot
                key={container.Id}
                health={container.health}
                size={7}
                title={`${container.Name} · ${container.health}`}
            />
        ))}
    </Box>
);

export default ContainerDots;
