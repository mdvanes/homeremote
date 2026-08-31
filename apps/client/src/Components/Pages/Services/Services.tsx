import { ServiceStack } from "@homeremote/types";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Tab,
    Tabs,
} from "@mui/material";
import { FC, useRef, useState } from "react";
import { Link as RouterLink, useSearchParams } from "react-router";
import { useGetServicesQuery } from "../../../Services/servicesApi";
import { healthColor } from "../../Molecules/ServicesPanel/HealthDot";
import { LinkConfigSectionHandle } from "./LinkConfigSection";
import { StackDetail } from "./StackDetail";

const UPDATE_INTERVAL_MS = 30000;

export const Services: FC = () => {
    const { data, isFetching, refetch } = useGetServicesQuery(undefined, {
        pollingInterval: UPDATE_INTERVAL_MS,
    });
    const [searchParams, setSearchParams] = useSearchParams();
    // Deep-link support: /services?stack=<id> opens directly on that stack
    // (e.g. clicked from a dashboard row). Falls back to the first stack.
    const [selected, setSelected] = useState<string | false>(
        searchParams.get("stack") ?? false
    );

    const received = data?.status === "received" ? data : undefined;
    const stacks: ServiceStack[] = received?.stacks ?? [];

    const activeId =
        selected !== false && stacks.some((stack) => stack.Id === selected)
            ? selected
            : stacks[0]?.Id;
    const active = stacks.find((stack) => stack.Id === activeId);

    const linkConfigRef = useRef<LinkConfigSectionHandle>(null);
    const [pendingStackId, setPendingStackId] = useState<string | null>(null);

    const selectStack = (id: string) => {
        setSelected(id);
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                next.set("stack", id);
                return next;
            },
            { replace: true }
        );
    };

    const requestSelectStack = (id: string) => {
        if (id === activeId) {
            return;
        }
        if (linkConfigRef.current?.hasUnsavedChanges()) {
            setPendingStackId(id);
            return;
        }
        selectStack(id);
    };

    const confirmDiscardChanges = () => {
        if (pendingStackId) {
            selectStack(pendingStackId);
        }
        setPendingStackId(null);
    };

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
                        to="/dashboard"
                        size="small"
                        aria-label="Back to dashboard"
                    >
                        <ArrowBackIcon fontSize="small" />
                    </IconButton>
                    <Box sx={{ fontSize: 14, fontWeight: 500 }}>Services</Box>
                    <IconButton
                        size="small"
                        aria-label="Refresh"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        sx={{ marginLeft: "auto" }}
                    >
                        <RefreshIcon fontSize="small" />
                    </IconButton>
                </Box>

                {stacks.length > 0 && (
                    <>
                        <Tabs
                            value={activeId ?? false}
                            onChange={(_event, value) =>
                                requestSelectStack(value)
                            }
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                minHeight: 36,
                                borderBottom: "1px solid",
                                borderColor: "divider",
                            }}
                        >
                            {stacks.map((stack) => (
                                <Tab
                                    key={stack.Id}
                                    value={stack.Id}
                                    label={stack.Name}
                                    sx={{
                                        minHeight: 36,
                                        textTransform: "none",
                                        fontSize: 12,
                                        color:
                                            stack.health === "running"
                                                ? undefined
                                                : healthColor[stack.health],
                                    }}
                                />
                            ))}
                        </Tabs>
                        {active && (
                            <StackDetail
                                stack={active}
                                linkConfigRef={linkConfigRef}
                            />
                        )}
                    </>
                )}
            </CardContent>
            <Dialog
                open={pendingStackId !== null}
                onClose={() => setPendingStackId(null)}
            >
                <DialogTitle>Discard unsaved changes?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        The service link configuration has unsaved changes.
                        Switching services will discard them.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPendingStackId(null)}>
                        Cancel
                    </Button>
                    <Button color="error" onClick={confirmDiscardChanges}>
                        Discard changes
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default Services;
