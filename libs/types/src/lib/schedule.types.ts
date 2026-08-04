export type ScheduleItemKind = "tvshow" | "movie";

interface ScheduleItemBase {
    id: string;
    kind: ScheduleItemKind;
    date: string; // yyyy-mm-dd
    title: string;
    posterUrl: string | null; // server-relative proxy path
    monitored: boolean;
    hasFile: boolean;
}

export interface TvShowScheduleItem extends ScheduleItemBase {
    kind: "tvshow";
    seasonNumber: number;
    episodeNumber: number;
    episodeTitle: string;
}

export interface MovieScheduleItem extends ScheduleItemBase {
    kind: "movie";
}

export type ScheduleItem = TvShowScheduleItem | MovieScheduleItem;

export interface GetScheduleResponse {
    items: ScheduleItem[];
}
