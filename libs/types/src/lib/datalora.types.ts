export interface TrackerItem {
    loc: [number, number];
    time: string;
    name: string;
    batteryLevel?: number;
}

export type TrackerQueryType = "24h" | "all";
