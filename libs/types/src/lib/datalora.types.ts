export interface TrackerItem {
    loc: [number, number];
    time: string;
    name: string;
}

export type TrackerQueryType = "24h" | "all";
