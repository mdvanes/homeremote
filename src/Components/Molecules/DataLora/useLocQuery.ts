import { useEffect, useState } from "react";
import { Item, QueryType } from "./types";

const UPDATE_INTERVAL = 1000 * 60 * 60; // 1000 ms / 60 seconds / 60 minutes = 1x per hour

const getCoords = async (type: string) => {
    const result = await fetch(`/api/datalora?type=${type}`);
    const json: { data: Item[] } = await result.json();
    return json.data;
};

interface LocQuery {
    coords: Item[];
    update: (type: string) => Promise<void>;
    toggleQueryType: () => void;
    isLoading: boolean;
    queryType: QueryType;
}

// TODO convert to RTKQ
export const useLocQuery = (): LocQuery => {
    const [coords, setCoords] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [queryType, setQueryType] = useState<QueryType>("24h");

    const update = async (type: string): Promise<void> => {
        setIsLoading(true);
        try {
            const result = await getCoords(type);
            if (result.length > 0) {
                setCoords(result);
            }
        } catch (err) {
            console.error(err);
        }
        setIsLoading(false);
    };

    const toggleQueryType = () => {
        const newType = queryType === "all" ? "24h" : "all";
        setQueryType(newType);
        update(newType);
    };

    useEffect(() => {
        update(queryType);
        // Auto-update
        const interval = setInterval(() => {
            update(queryType);
        }, UPDATE_INTERVAL);
        return () => clearInterval(interval);
    }, [queryType]);

    return { coords, update, isLoading, toggleQueryType, queryType };
};
