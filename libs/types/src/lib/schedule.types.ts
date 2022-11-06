export interface ScheduleItem {
    airdate: string; // yyyy-mm-dd
    airs: string; // Day hh:mm AM
    ep_name: string;
    ep_plot: string;
    episode: number;
    indexerid: number;
    network: string;
    paused: number; // 0 = not paused (I assume)
    quality: string;
    season: number;
    show_name: string;
    show_status: string; // e.g. "Continuing"
    tvdbid: number;
    weekday: number;
}

export interface GetScheduleResponse {
    data: {
        later: ScheduleItem[];
        missed: ScheduleItem[];
        snatched: ScheduleItem[];
        soon: ScheduleItem[];
        today: ScheduleItem[];
    };
    message: "";
    result: "success";
}
