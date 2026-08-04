import { FC } from "react";
import { useGetServicesQuery } from "../../../Services/servicesApi";
import { usePolledQuery } from "../../../Utils/usePolledQuery";
import { ServiceLinkBar } from "./ServiceLinkBar";

const UPDATE_INTERVAL_MS = 30000;

// Renders above the ServicesPanel card, sharing its RTK Query cache entry so
// no extra network requests are made. Errors are already reported by
// ServicesPanel, so this doesn't log them a second time.
export const ServiceLinkBarSection: FC = () => {
    const { data } = usePolledQuery(useGetServicesQuery, undefined, {
        name: "Services",
        pollingInterval: UPDATE_INTERVAL_MS,
        onError: () => undefined,
    });

    const received = data?.status === "received" ? data : undefined;

    if (!received) {
        return null;
    }

    return <ServiceLinkBar links={received.serviceLinks} />;
};

export default ServiceLinkBarSection;
