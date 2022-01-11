import { useState } from "react";
import { useGetCoordsQuery } from "../../../Services/dataloraApi";
import { Item, QueryType } from "./types";

// TODO Interval does not seem to work
const UPDATE_INTERVAL_MS = 1000 * 60 * 60; // 1000 ms / 60 seconds / 60 minutes = 1x per hour

interface LocQuery {
    coords: Item[];
    update: () => Promise<void>;
    toggleQueryType: () => void;
    isLoading: boolean;
    queryType: QueryType;
}

export const useLocQuery = (): LocQuery => {
    const [queryType, setQueryType] = useState<QueryType>("24h");
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