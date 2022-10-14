export interface IPlaylist {
    id: string;
    name: string;
}

export type PlaylistsResponse =
    | {
          status: "received";
          playlists: IPlaylist[];
      }
    | {
          status: "error";
      };
