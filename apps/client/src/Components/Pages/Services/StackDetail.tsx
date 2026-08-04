import { ServiceStack } from "@homeremote/types";
import { Box, Chip } from "@mui/material";
import { FC } from "react";
import { HealthDot } from "../../Molecules/ServicesPanel/HealthDot";
import { ServiceStackActions } from "../../Molecules/ServicesPanel/ServiceStackActions";
import { ContainerRow } from "./ContainerRow";
import { LinkConfigSection } from "./LinkConfigSection";

interface StackDetailProps {
    stack: ServiceStack;
}

export const StackDetail: FC<StackDetailProps> = ({ stack }) => {
    const running = stack.containers.filter(
        (container) => container.health === "running"
    ).length;

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    paddingX: 1,
                    paddingY: 1,
                }}
            >
                <HealthDot health={stack.health} size={10} />
                <Box sx={{ fontSize: 14, fontWeight: 500 }}>{stack.Name}</Box>
                <Chip
                    size="small"
                    label={`${running} / ${stack.containers.length} running`}
                    color={
                        stack.health === "running"
                            ? "success"
                            : stack.health === "degraded"
                              ? "warning"
                              : "error"
                    }
                    variant="outlined"
                    sx={{ height: 20, fontSize: 11 }}
                />
                <Box sx={{ marginLeft: "auto" }}>
                    <ServiceStackActions stack={stack} alwaysVisible />
                </Box>
            </Box>

            <LinkConfigSection stack={stack} />

            <Box>
                {stack.containers.map((container) => (
                    <ContainerRow key={container.Id} container={container} />
                ))}
                {stack.containers.length === 0 && (
                    <Box
                        sx={{
                            padding: 1,
                            fontSize: 12,
                            color: "text.secondary",
                        }}
                    >
                        No running containers for this stack.
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default StackDetail;
