export interface NextUpVideoItem {
    Name: string;
    SeriesName: string;
}

export interface UserLatestItem {
    Name: string;
    SeriesName: string;
    CommunityRating: number;
    ParentIndexNumber: number;
    IndexNumber: number;
    Id: string;
    SeriesId: string;
    ImageTags: {
        Primary: string;
    };
}

export type UserLatestResponse = UserLatestItem[];

export interface ShowNextUpItem {
    Id: string;
    SeriesName: string;
    ParentIndexNumber: number;
    IndexNumber: number;
    Name: string;
    ProductionYear: number;
    CommunityRating: number;
    ImageTags: {
        Primary: string;
    };
}

export interface ShowNextUpResponse {
    Items: [ShowNextUpItem];
}

export interface GetNextUpResponse {
    items: ShowNextUpItem[];
}
