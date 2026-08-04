import { ServiceContainer } from "@homeremote/types";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DescriptionIcon from "@mui/icons-material/Description";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Box, Chip, CircularProgress, IconButton } from "@mui/material";
import { FC } from "react";
import { Link as RouterLink } from "react-router";
import { useControlContainerMutation } from "../../../Services/servicesApi";
import { HealthDot } from "../../Molecules/ServicesPanel/HealthDot";
import { formatUptime } from "./uptime";

interface ContainerRowProps {
    container: ServiceContainer;
}

export const ContainerRow: FC<ContainerRowProps> = ({ container }) => {
    const [controlContainer, { isLoading }] = useControlContainerMutation();
    const uptime = formatUptime(container.createdAt);

    return (
        <Box
            sx={{
                display: "flex",
                gap: 1,
                alignItems: "flex-start",
                paddingX: 1,
                paddingY: 0.75,
                borderTop: "1px solid",
                borderColor: "divider",
            }}
        >
            <HealthDot
                health={container.health}
                title={`${container.Name} · ${container.health}`}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ fontSize: 13, fontWeight: 500 }}>
                    {container.Name}
                </Box>
                {container.Image && (
                    <Box
                        sx={{
                            fontSize: 11,
                            color: "text.secondary",
                            fontFamily: "monospace",
                            wordBreak: "break-all",
                        }}
                    >
                        {container.Image}
                    </Box>
                )}
                <Box
                    sx={{
                        display: "flex",
                        gap: 0.5,
                        flexWrap: "wrap",
                        alignItems: "center",
                        marginTop: 0.25,
                    }}
                >
                    {uptime && (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.25,
                                fontSize: 11,
                                color: "text.secondary",
                            }}
                        >
                            <AccessTimeIcon sx={{ fontSize: 12 }} />
                            {uptime}
                        </Box>
                    )}
                    {container.ports.map((port) => {
                        const key = `${port.publicPort ?? ""}:${
                            port.privatePort ?? ""
                        }/${port.type ?? ""}`;
                        const label = port.internal
                            ? `${port.privatePort}/${port.type ?? "tcp"}`
                            : `:${port.publicPort}→${port.privatePort}`;
                        return (
                            <Chip
                                key={key}
                                label={label}
                                size="small"
                                variant="outlined"
                                sx={{
                                    height: 18,
                                    fontSize: 10,
                                    fontFamily: "monospace",
                                    opacity: port.internal ? 0.5 : 1,
                                }}
                            />
                        );
                    })}
                </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                {isLoading && <CircularProgress size={14} />}
                <IconButton
                    component={RouterLink}
                    to={`/services/logs/${container.Id}`}
                    size="small"
                    title="Logs"
                    aria-label={`Logs for ${container.Name}`}
                >
                    <DescriptionIcon fontSize="small" />
                </IconButton>
                <IconButton
                    size="small"
                    title="Restart"
                    aria-label={`Restart container ${container.Name}`}
                    disabled={isLoading}
                    onClick={() =>
                        controlContainer({
                            id: container.Id,
                            action: "restart",
                        })
                    }
                >
                    <RestartAltIcon fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    );
};

export default ContainerRow;
