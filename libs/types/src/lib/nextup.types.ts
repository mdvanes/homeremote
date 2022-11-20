export interface NextUpVideoItem {
    Name: string;
    SeriesName: string;
}

export interface GetNextUpResponse {
    items: NextUpVideoItem[];
}
