import { TrackerItem, TrackerQueryType } from "@homeremote/types";
import { useState } from "react";
import { useGetCoordsQuery } from "../../../Services/dataloraApi";

const UPDATE_INTERVAL_MS = 1000 * 60 * 60; // 1000 ms / 60 seconds / 60 minutes = 1x per hour

interface LocQuery {
    coords: TrackerItem[];
    update: () => Promise<void>;
    toggleQueryType: () => void;
    isLoading: boolean;
    queryType: TrackerQueryType;
}

export const useLocQuery = (): LocQuery => {
    const [queryType, setQueryType] = useState<TrackerQueryType>("24h");
    const {
        data: coords,
        isLoading,
        isFetching,
        refetch,
    } = useGetCoordsQuery(
        {
            type: queryType,
        },
        { pollingInterval: UPDATE_INTERVAL_MS, refetchOnMountOrArgChange: true }
    );

    const update = async (): Promise<void> => {
        refetch();
    };

    const toggleQueryType = () => {
        const newType = queryType === "all" ? "24h" : "all";
        setQueryType(newType);
    };

    return {
        coords: coords || [],
        update,
        isLoading: isLoading || isFetching,
        toggleQueryType,
        queryType,
    };
};
