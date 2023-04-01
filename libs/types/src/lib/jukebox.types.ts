type IsoDateString = string; // '2023-01-28T11:29:06.000Z',

export interface SubsonicDirectory {
    id: string;
    artist: string;
    album?: string;
    isDir: boolean;
    title?: string; // dir name, not album name
    track?: number;
}

export interface SubsonicAlbum extends SubsonicDirectory {
    isDir: true;
    genre?: string;
    coverArt?: string;
    playCount?: number;
    created?: IsoDateString;
    starred?: IsoDateString;
}

export interface SubsonicSong extends SubsonicDirectory {
    isDir: false;
    duration: number;
    img?: string;
    parent?: string;

  
}

export interface SubsonicGetStarredResponse {
    "subsonic-response"?: {
        status: "ok";
        version: string;
        starred?: {
            artist?: SubsonicSong[];
            album?: SubsonicAlbum[];
        };
    };
}

export interface SubsonicGetMusicDirectoryResponse {
    "subsonic-response"?: {
        status: "ok";
        version: string;
        directory?: {
            id?: string;
            name?: string;
            starred?: IsoDateString;
            playCount: number;
            child: any[];
        };
    };
}

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

export type AddSongArg = {
    playlistId: string;
    songId: string;
};

export type AddSongResponse = {
    status: "received" | "error";
};
