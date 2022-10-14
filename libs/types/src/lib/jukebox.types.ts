export interface IPlaylist {
    id: string;
    name: string;
}

export interface ISong {
    id: string;
    artist: string;
    title: string;
    duration: number;
    album?: string;
    url: string;
}

export type PlaylistsResponse =
    | {
          status: "received";
          playlists: IPlaylist[];
      }
    | {
          status: "error";
      };

export type PlaylistResponse =
    | {
          status: "received";
          songs: ISong[];
      }
    | {
          status: "error";
      };

export type PlaylistArgs = { id: string };
