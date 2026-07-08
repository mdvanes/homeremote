import { ServiceStack, ServicesSummary } from "@homeremote/types";
import { Box } from "@mui/material";
import { FC, useState } from "react";
import { useGetServicesQuery } from "../../../Services/servicesApi";
import { usePolledQuery } from "../../../Utils/usePolledQuery";
import CardExpandBar from "../CardExpandBar/CardExpandBar";
import { staleContentSx } from "../CardStatus/CardStatus";
import CardStatusBar from "../CardStatusBar/CardStatusBar";
import { ServiceLinkBar } from "./ServiceLinkBar";
import { ServiceStackRow } from "./ServiceStackRow";

const UPDATE_INTERVAL_MS = 30000;

const SectionLabel: FC<{ left: string; right: string }> = ({ left, right }) => (
    <Box
        sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingX: 1,
            paddingY: 0.25,
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: 0.4,
            textTransform: "uppercase",
            color: "text.secondary",
        }}
    >
        <span>{left}</span>
        <Box component="span" sx={{ textTransform: "none", letterSpacing: 0 }}>
            {right}
        </Box>
    </Box>
);

const HealthFooter: FC<{ summary: ServicesSummary }> = ({ summary }) => (
    <Box
        sx={{
            paddingX: 1,
            paddingY: 0.5,
            fontSize: 11,
            color: "text.secondary",
        }}
    >
        {summary.healthy} healthy
        {" · "}
        <Box component="span" sx={{ color: "warning.main" }}>
            {summary.degraded} degraded
        </Box>
        {" · "}
        <Box component="span" sx={{ color: "error.main" }}>
            {summary.stopped} stopped
        </Box>
    </Box>
);

export const ServicesPanel: FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {
        data,
        isLoading,
        isFetching,
        isError,
        isStale,
        lastUpdated,
        retry,
    } = usePolledQuery(useGetServicesQuery, undefined, {
        name: "Services",
        pollingInterval: UPDATE_INTERVAL_MS,
    });

    const received = data?.status === "received" ? data : undefined;
    const stacks: ServiceStack[] = received?.stacks ?? [];
    const problems = stacks.filter((stack) => stack.health !== "running");
    const healthy = stacks.filter((stack) => stack.health === "running");

    return (
        <>
            <CardStatusBar
                isLoading={(isLoading || isFetching) && !isError}
                name="Services"
                isError={isError}
                isStale={isStale}
                retry={retry}
                lastUpdated={lastUpdated}
            />
            {received && (
                <Box sx={staleContentSx(isStale)}>
                    <ServiceLinkBar links={received.serviceLinks} />

                    <SectionLabel
                        left="Problems"
                        right={`${problems.length} of ${stacks.length} stacks`}
                    />
                    {problems.length === 0 ? (
                        <Box
                            sx={{
                                paddingX: 1,
                                paddingY: 0.5,
                                fontSize: 12,
                                color: "text.secondary",
                            }}
                        >
                            All services healthy
                        </Box>
                    ) : (
                        problems.map((stack) => (
                            <ServiceStackRow key={stack.Id} stack={stack} />
                        ))
                    )}

                    {isOpen && (
                        <>
                            <SectionLabel
                                left="Healthy stacks"
                                right={`${healthy.length} of ${stacks.length}`}
                            />
                            {healthy.map((stack) => (
                                <ServiceStackRow key={stack.Id} stack={stack} />
                            ))}
                        </>
                    )}

                    {received.summary && (
                        <HealthFooter summary={received.summary} />
                    )}

                    {healthy.length > 0 && (
                        <CardExpandBar
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            hint={`Show all ${stacks.length}`}
                        />
                    )}
                </Box>
            )}
        </>
    );
};

export default ServicesPanel;
