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
import { FC, useEffect, useRef, useState } from "react";
import {
    Link as RouterLink,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router";
import { buildServicesStackPath, ROUTES } from "../../../routes";
import { useGetServicesQuery } from "../../../Services/servicesApi";
import { healthColor } from "../../Molecules/ServicesPanel/HealthDot";
import { LinkConfigSectionHandle } from "./LinkConfigSection";
import { StackDetail } from "./StackDetail";

const UPDATE_INTERVAL_MS = 30000;

// A stack can be looked up either by its (readable, URL-friendly) Name - the
// canonical form for new links - or by its Id, kept as a fallback so old
// `?stack=<Id>` bookmarks/links still resolve to the right stack.
const findStack = (
    stacks: ServiceStack[],
    identifier: string | undefined
): ServiceStack | undefined =>
    identifier === undefined
        ? undefined
        : (stacks.find((stack) => stack.Name === identifier) ??
          stacks.find((stack) => stack.Id === identifier));

export const Services: FC = () => {
    const { data, isFetching, refetch } = useGetServicesQuery(undefined, {
        pollingInterval: UPDATE_INTERVAL_MS,
    });
    const navigate = useNavigate();
    const { stackName } = useParams<{ stackName: string }>();
    const [searchParams] = useSearchParams();
    const decodedStackName = stackName
        ? decodeURIComponent(stackName)
        : undefined;
    // Legacy deep-link support: /services?stack=<Id> (e.g. an old bookmark, or
    // a link clicked from a dashboard row before the URL scheme changed).
    const legacyStackId = searchParams.get("stack") ?? undefined;

    const received = data?.status === "received" ? data : undefined;
    const stacks: ServiceStack[] = received?.stacks ?? [];

    const active =
        findStack(stacks, decodedStackName) ??
        findStack(stacks, legacyStackId) ??
        stacks[0];

    // Normalise the URL once the stacks are known: redirect a bare /services,
    // a legacy ?stack=<Id> link, or an unknown stack name onto the canonical
    // /services/<Name> path for the resolved active stack. Uses `replace` so
    // this normalisation never creates an extra history entry.
    useEffect(() => {
        if (stacks.length === 0 || !active) {
            return;
        }
        const canonicalName = active.Name;
        if (decodedStackName !== canonicalName) {
            navigate(buildServicesStackPath(canonicalName), {
                replace: true,
            });
        }
    }, [stacks.length, active, decodedStackName, navigate]);

    const linkConfigRef = useRef<LinkConfigSectionHandle>(null);
    const [pendingStackName, setPendingStackName] = useState<string | null>(
        null
    );

    // Pushed (not replaced) so the browser back/forward buttons step through
    // previously viewed stacks.
    const selectStack = (name: string) => {
        navigate(buildServicesStackPath(name));
    };

    const requestSelectStack = (name: string) => {
        if (name === active?.Name) {
            return;
        }
        if (linkConfigRef.current?.hasUnsavedChanges()) {
            setPendingStackName(name);
            return;
        }
        selectStack(name);
    };

    const confirmDiscardChanges = () => {
        if (pendingStackName) {
            selectStack(pendingStackName);
        }
        setPendingStackName(null);
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
                        to={ROUTES.dashboard}
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
                            value={active?.Name ?? false}
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
                                    value={stack.Name}
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
                open={pendingStackName !== null}
                onClose={() => setPendingStackName(null)}
            >
                <DialogTitle>Discard unsaved changes?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        The service link configuration has unsaved changes.
                        Switching services will discard them.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPendingStackName(null)}>
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
