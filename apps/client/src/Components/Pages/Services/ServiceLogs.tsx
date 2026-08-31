import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
    Box,
    Card,
    CardContent,
    CircularProgress,
    IconButton,
} from "@mui/material";
import { FC } from "react";
import { Link as RouterLink, useParams } from "react-router";
import { buildServicesStackPath, ROUTES } from "../../../routes";
import { useGetContainerLogsQuery } from "../../../Services/servicesApi";

export const ServiceLogs: FC = () => {
    const { stackName = "", containerId = "" } = useParams<{
        stackName: string;
        containerId: string;
    }>();
    const { data, isFetching, refetch } = useGetContainerLogsQuery(
        containerId,
        {
            skip: !containerId,
        }
    );

    const logs = data?.status === "received" ? data.logs : "No logs available.";
    const backToStackPath = stackName
        ? buildServicesStackPath(decodeURIComponent(stackName))
        : ROUTES.services;

    return (
        <Card sx={{ position: "relative" }}>
            <CardContent>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        marginBottom: 1,
                    }}
                >
                    <IconButton
                        component={RouterLink}
                        to={backToStackPath}
                        size="small"
                        aria-label="Back to services"
                    >
                        <ArrowBackIcon fontSize="small" />
                    </IconButton>
                    <Box sx={{ fontSize: 14, fontWeight: 500 }}>
                        Logs · {containerId}
                    </Box>
                    <IconButton
                        size="small"
                        aria-label="Refresh"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        sx={{ marginLeft: "auto" }}
                    >
                        {isFetching ? (
                            <CircularProgress size={16} />
                        ) : (
                            <RefreshIcon fontSize="small" />
                        )}
                    </IconButton>
                </Box>
                <Box
                    component="pre"
                    sx={{
                        margin: 0,
                        padding: 1,
                        borderRadius: 1,
                        backgroundColor: "action.hover",
                        fontFamily: "monospace",
                        fontSize: 12,
                        lineHeight: 1.5,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                        maxHeight: "70vh",
                        overflow: "auto",
                    }}
                >
                    {logs}
                </Box>
            </CardContent>
        </Card>
    );
};

export default ServiceLogs;
