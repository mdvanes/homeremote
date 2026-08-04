import { ServiceStack } from "@homeremote/types";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, IconButton } from "@mui/material";
import { FC, KeyboardEventHandler } from "react";
import { useNavigate } from "react-router";
import { ContainerDots } from "./ContainerDots";
import { HealthDot } from "./HealthDot";
import { ServiceStackActions } from "./ServiceStackActions";

interface ServiceStackRowProps {
    stack: ServiceStack;
}

export const ServiceStackRow: FC<ServiceStackRowProps> = ({ stack }) => {
    const navigate = useNavigate();
    const linkUrl = stack.link?.url;
    const isHealthy = stack.health === "running";

    const openDetail = () => {
        navigate(`/services?stack=${encodeURIComponent(stack.Id)}`);
    };

    const openDetailOnKeyDown: KeyboardEventHandler = (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openDetail();
        }
    };

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
                onClick={openDetail}
                onKeyDown={openDetailOnKeyDown}
                role="button"
                tabIndex={0}
                aria-label={`Open ${stack.Name} details`}
                sx={{
                    flex: 1,
                    color: isHealthy ? "text.secondary" : "text.primary",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                }}
            >
                {stack.Name}
            </Box>
            <Box onClick={openDetail} sx={{ minWidth: 0, cursor: "pointer" }}>
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
