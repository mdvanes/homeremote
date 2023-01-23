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

export interface SongDirItem {
    id: string;
    parent: string;
    isDir: boolean;
    title: string;
    album: string;
    artist: string;
    size: number;
    contentType: string;
    suffix: string;
    duration: number;
    bitRate: number;
    path: string;
    playCount: number;
    created: string;
    albumId: string;
    artistId: string;
    type: string;
}

export type SongDirResponse =
    | {
          status: "received";
          dir: {
              album: string;
              artist: string;
              created: string;
              id: string;
              isDir: boolean;
              parent: string;
              playCount: number;
              title: string;
          };
          content: SongDirItem[];
      }
    | {
          status: "error";
      };
