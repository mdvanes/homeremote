import { TrackerItem, TrackerQueryType } from "@homeremote/types";
import { useEffect, useState } from "react";
import { useGetCoordsQuery } from "../../../Services/dataloraApi";
import { getErrorMessage } from "../../../Utils/getErrorMessage";
import { useAppDispatch } from "../../../store";
import { logInfo } from "../LogCard/logSlice";

const UPDATE_INTERVAL_MS = 1000 * 60 * 60; // 1000 ms / 60 seconds / 60 minutes = 1x per hour

interface LocQuery {
    coords: TrackerItem[][];
    update: () => Promise<void>;
    toggleQueryType: () => void;
    isLoading: boolean;
    queryType: TrackerQueryType;
}

export const useLocQuery = (): LocQuery => {
    const dispatch = useAppDispatch();

    const [queryType, setQueryType] = useState<TrackerQueryType>("24h");
    const {
        data: coords,
        isLoading,
        isFetching,
        refetch,
        isError,
        error,
    } = useGetCoordsQuery(
        {
            type: queryType,
        },
        { pollingInterval: UPDATE_INTERVAL_MS, refetchOnMountOrArgChange: true }
    );

    useEffect(() => {
        if (isError && error) {
            // This errors to often to use logError
            dispatch(logInfo(`useLocQuery failed: ${getErrorMessage(error)}`));
        }
    }, [dispatch, error, isError]);

    // There often is an error on the first call, so retry after 5 seconds (also if there is no error)
    useEffect(() => {
        setTimeout(() => {
            refetch();
        }, 5000);
    }, [refetch]);

    const update = async (): Promise<void> => {
        refetch();
    };

    const toggleQueryType = () => {
        const newType = queryType === "all" ? "24h" : "all";
        setQueryType(newType);
    };

    return {
        coords: coords ?? [[], []],
        update,
        isLoading: isLoading || isFetching,
        toggleQueryType,
        queryType,
    };
};
