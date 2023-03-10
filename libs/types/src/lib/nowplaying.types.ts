interface NowPlayingResponse {
    artist: string;
    title: string;
    last_updated: string;
    songImageUrl: string;
    name: string;
    imageUrl: string;
}

export type ISOTimeString = string;
export interface RadioMetadata {
    time?: {
        start?: ISOTimeString;
        end?: ISOTimeString;
    };
    broadcast?: {
        title?: string;
        presenters?: string;
        imageUrl?: string;
    };
    song: {
        artist?: string;
        title?: string;
        imageUrl?: string;
        listenUrl?: string;
    };
}

export interface PreviouslyResponse extends NowPlayingResponse {
    broadcast: RadioMetadata["broadcast"];
    time: RadioMetadata["time"];
    listenUrl: RadioMetadata["song"]["listenUrl"];
}
