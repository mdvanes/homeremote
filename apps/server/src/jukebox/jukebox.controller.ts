import {
    type AddSongArg,
    AddSongResponse,
    BrowseItem,
    BrowseResponse,
    IPlaylist,
    ISong,
    PlaylistResponse,
    PlaylistsResponse,
    RecentAlbumsResponse,
    SongDirItem,
    SongDirResponse,
    SubsonicAlbum,
    SubsonicApiGetAlbumListResponse,
    SubsonicApiGetIndexesResponse,
    SubsonicGetMusicDirectoryResponse,
    SubsonicGetStarredResponse,
    SubsonicSong,
} from "@homeremote/types";
import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    NotFoundException,
    Param,
    Post,
    Query,
    StreamableFile,
    UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createHash, randomBytes } from "crypto";
import got from "got";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

const PLAYER_NAME = "HomeRemoteJukebox";

const isSubsonicSong = (
    item: SubsonicAlbum | SubsonicSong
): item is SubsonicSong => {
    return !item.isDir;
};

@Controller("api/jukebox")
export class JukeboxController {
    private readonly logger: Logger;
    private readonly baseUrl: string;
    private readonly username: string;
    private readonly password: string;
    private readonly songDirId: string;

    constructor(private configService: ConfigService) {
        this.logger = new Logger(JukeboxController.name);
        this.baseUrl = this.configService.get<string>("JUKEBOX_BASE_URL") || "";
        this.username =
            this.configService.get<string>("JUKEBOX_USERNAME") || "";
        this.password =
            this.configService.get<string>("JUKEBOX_PASSWORD") || "";

        const JUKEBOX_SONGDIR_ID =
            this.configService.get<string>("JUKEBOX_SONGDIR_ID") || "";
        this.songDirId = JUKEBOX_SONGDIR_ID;
    }

    /**
     * Build the Subsonic authentication parameters using the recommended
     * salted token scheme: for each request a random salt is generated and
     * the token is calculated as token = md5(password + salt).
     * See https://subsonic.org/pages/api.jsp
     */
    private getApiConfig(): string {
        const salt = randomBytes(6).toString("hex");
        const token = createHash("md5")
            .update(`${this.password}${salt}`, "utf8")
            .digest("hex");
        return `?u=${this.username}&t=${token}&s=${salt}&v=1.16.0&c=${PLAYER_NAME}&f=json`;
    }

    getAPI(method: string, option = "") {
        return this.baseUrl + method + this.getApiConfig() + option;
    }

    @UseGuards(JwtAuthGuard)
    @Get("playlists")
    async getPlaylists(): Promise<PlaylistsResponse> {
        this.logger.verbose("GET to /api/jukebox/playlists");

        try {
            const url = this.getAPI("getPlaylists");
            const response = await got(url).json();
            const playlists = response[
                "subsonic-response"
            ].playlists.playlist.map(({ id, name, coverArt }) => ({
                id,
                name,
                coverArt,
                type: "playlist",
            }));

            const starredUrl = this.getAPI("getStarred");
            const starredResponse: SubsonicGetStarredResponse =
                await got(starredUrl).json();
            const starredAlbums: IPlaylist[] = starredResponse[
                "subsonic-response"
            ].starred.album.map(({ id, title, coverArt }) => ({
                id,
                name: title,
                coverArt,
                type: "album",
            }));

            return {
                status: "received",
                playlists: [...playlists, ...starredAlbums],
            };
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("starred")
    async getStarred(): Promise<{
        status: "received";
        albums: SubsonicAlbum[];
    }> {
        this.logger.verbose("GET to /api/jukebox/starred");

        try {
            const url = this.getAPI("getStarred");
            const response: SubsonicGetStarredResponse = await got(url).json();

            return {
                status: "received",
                albums: response["subsonic-response"].starred.album,
            };
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("playlist/:id")
    async getPlaylist(
        @Param("id") id: string,
        @Query("type") type: string
    ): Promise<PlaylistResponse> {
        this.logger.verbose(`GET to /api/jukebox/playlist/:id ${id} ${type}`);

        try {
            if (type === "album") {
                const url = this.getAPI("getMusicDirectory", `&id=${id}`);
                const response: SubsonicGetMusicDirectoryResponse =
                    await got(url).json();
                const songs: ISong[] = response[
                    "subsonic-response"
                ].directory.child
                    .filter(isSubsonicSong)
                    .map(({ id, artist, title, duration, track }) => {
                        return {
                            id,
                            artist,
                            track,
                            title,
                            duration,
                        };
                    });
                return { status: "received", songs };
            }

            const url = this.getAPI("getPlaylist", `&id=${id}`);
            const response = await got(url).json();
            const playlist = response["subsonic-response"].playlist;
            const songs =
                playlist?.entry && playlist.entry.length > 0
                    ? (playlist.entry as ISong[]).map(
                          ({ id, artist, title, duration }) => {
                              return {
                                  id,
                                  artist,
                                  title,
                                  duration,
                              };
                          }
                      )
                    : [];

            return { status: "received", songs };
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("musicdir/:id")
    async getMusicDirectory(
        @Param("id") id: string
    ): Promise<PlaylistResponse> {
        this.logger.verbose("GET to /api/jukebox/musicdir/:id");

        try {
            const url = this.getAPI("getMusicDirectory", `&id=${id}`);
            const response: SubsonicGetMusicDirectoryResponse =
                await got(url).json();
            const songs: ISong[] = response["subsonic-response"].directory.child
                .filter(isSubsonicSong)
                .map(({ id, artist, title, duration }) => {
                    return {
                        id,
                        artist,
                        title,
                        duration,
                    };
                });

            return { status: "received", songs };
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("browse")
    async getBrowseRoot(): Promise<BrowseResponse> {
        this.logger.verbose("GET to /api/jukebox/browse");

        try {
            const url = this.getAPI("getIndexes");
            const response: SubsonicApiGetIndexesResponse =
                await got(url).json();
            const artists = (response["subsonic-response"]?.indexes?.index ||
                []) as { artist?: { id?: string; name?: string }[] }[];
            const items: BrowseItem[] = artists
                .flatMap((index) => index.artist || [])
                .map(({ id, name }) => ({
                    id: id || "",
                    title: name || "",
                    isDir: true,
                }));

            return { status: "received", parentId: null, items };
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("browse/:id")
    async getBrowseDir(@Param("id") id: string): Promise<BrowseResponse> {
        this.logger.verbose(`GET to /api/jukebox/browse/:id ${id}`);

        try {
            const url = this.getAPI("getMusicDirectory", `&id=${id}`);
            const response: SubsonicGetMusicDirectoryResponse =
                await got(url).json();
            const children = response["subsonic-response"]?.directory
                ?.child as Array<SubsonicAlbum | SubsonicSong>;
            const items: BrowseItem[] = (children || []).map((child) => ({
                id: child.id,
                title: child.title || child.album || "",
                isDir: child.isDir,
                artist: child.artist,
                album: child.album,
                track: child.track,
                duration: isSubsonicSong(child) ? child.duration : undefined,
                coverArt: child.coverArt,
            }));

            return { status: "received", parentId: id, items };
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("recent")
    async getRecentAlbums(
        @Query("size") size?: string
    ): Promise<RecentAlbumsResponse> {
        this.logger.verbose("GET to /api/jukebox/recent");

        try {
            const albumListSize = parseInt(size || "20", 10) || 20;
            const url = this.getAPI(
                "getAlbumList",
                `&type=newest&size=${albumListSize}`
            );
            const response: SubsonicApiGetAlbumListResponse =
                await got(url).json();
            const albums: IPlaylist[] = (
                response["subsonic-response"]?.albumList?.album || []
            ).map(({ id, title, coverArt, artist, parent }) => ({
                id: id || "",
                name: title || "",
                coverArt,
                type: "album",
                artist,
                artistId: parent,
            }));

            return { status: "received", albums };
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get("song/:id")
    async getSong(
        @Param("id") id: string,
        @Query("hash") hash: string
    ): Promise<StreamableFile> {
        this.logger.verbose("GET to /api/jukebox/song/:id");
        const getSongUrl = this.getAPI("getSong", `&id=${id}`);

        try {
            const songResponse = await got(getSongUrl).json();

            // NOTE: when getting stream, validate the song id and the artist+title hash
            const { artist, title } = songResponse["subsonic-response"]
                .song as ISong;
            const artistTitle = `${artist} - ${title}`;

            if (hash !== artistTitle) {
                this.logger.error("hashes do not match");
                throw new NotFoundException(HttpStatus.NOT_FOUND);
            }

            const streamUrl = this.getAPI("stream", `&id=${id}`);
            const str = got.stream(streamUrl);
            return new StreamableFile(str);
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get("coverart/:id")
    async getCoverArt(
        @Param("id") id: string,
        @Query("type") type: "song" | "album" | "playlist",
        @Query("hash") hash: string
    ): Promise<StreamableFile> {
        this.logger.verbose(
            `GET to /api/jukebox/coverart/:id ${id} ${type} ${hash}`
        );

        try {
            const { retrievedHash, coverArtId } = await (async () => {
                if (type === "album") {
                    const url = this.getAPI("getMusicDirectory", `&id=${id}`);
                    const response: SubsonicGetMusicDirectoryResponse =
                        await got(url).json();
                    const directory = response["subsonic-response"]?.directory;
                    if (!directory) {
                        throw new NotFoundException(HttpStatus.NOT_FOUND);
                    }
                    return {
                        retrievedHash: directory.name,
                        coverArtId: directory.child?.[0]?.coverArt,
                    };
                }
                const url = this.getAPI("getPlaylist", `&id=${id}`);
                const response = await got(url).json();
                const playlist = response["subsonic-response"].playlist;
                return {
                    retrievedHash: playlist.name,
                    coverArtId: playlist.coverArt,
                };
            })();

            if (hash !== retrievedHash) {
                this.logger.error("hashes do not match");
                throw new NotFoundException(HttpStatus.NOT_FOUND);
            }

            const streamUrl = this.getAPI("getCoverArt", `&id=${coverArtId}`);
            const str = got.stream(streamUrl);
            return new StreamableFile(str);
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getSubDirForCurrentYear(
        songDirItems: SongDirItem[],
        currentYear: number
    ): Promise<SongDirItem> {
        const decadeDirTitle = `${Math.floor(currentYear / 10) * 10}s`;
        const decadeDir = songDirItems
            .filter((child) => child.isDir)
            .find((child) => child.title === decadeDirTitle);

        if (decadeDir) {
            const decadeDirContentUrl = this.getAPI(
                "getMusicDirectory",
                `&id=${decadeDir.id}`
            );
            const decadeDirContent = await got(decadeDirContentUrl).json();
            const decadeSubDirs = (
                decadeDirContent["subsonic-response"].directory
                    .child as SongDirItem[]
            ).filter((child) => child.isDir);
            const subdirForCurrentYear = decadeSubDirs.find(
                (subdir) => subdir.title === `${currentYear}`
            );
            if (subdirForCurrentYear) {
                return subdirForCurrentYear;
            }
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("songdir")
    async getSongDir(): Promise<SongDirResponse> {
        this.logger.verbose("GET to /api/jukebox/songdir");

        try {
            /*
            * Keep this in case the ID of Various or the subdir changes
            const url2 = this.getAPI("getIndexes");
            const response2 = await got(url2).json();
            const indexByFirstChar: any[] =
                response2["subsonic-response"].indexes.index;
            const vartists = indexByFirstChar.find((bar) => bar.name === "V");
            vartists.artist.find((artist) => artist.name === "Various");
            console.log(indexByFirstChar.find((bar) => bar.name === "V"));

            const url1 = this.getAPI("getMusicDirectory", "&id=67");
            const response1 = await got(url1).json();
            console.log(
                response1["subsonic-response"].directory.name,
                response1["subsonic-response"].directory.child
                    .filter((child) => child.isDir)
                    .find((child) => child.title === "Songs from")
            );
            */

            if (!this.songDirId || this.songDirId.length === 0) {
                const message = "JUKEBOX_SONGDIR_ID is not set or invalid";
                this.logger.error(message);
                throw new HttpException(message, HttpStatus.NOT_ACCEPTABLE);
            }

            const currentYear = new Date().getFullYear();

            const songDirUrl = this.getAPI(
                "getMusicDirectory",
                `&id=${this.songDirId}`
            );
            const songDirResponse = await got(songDirUrl).json();
            const songDirItems = songDirResponse["subsonic-response"].directory
                .child as SongDirItem[];
            const songDir = songDirItems
                .filter((child) => child.isDir)
                .find((child) => child.title === `${currentYear}`);
            const songSubDir = await this.getSubDirForCurrentYear(
                songDirItems,
                currentYear
            );

            const targetDir = songDir || songSubDir;

            if (!targetDir) {
                const message = `no song directory found for current year ${currentYear}`;
                throw new HttpException(message, HttpStatus.NOT_FOUND);
            }

            const songDirContentUrl = this.getAPI(
                "getMusicDirectory",
                `&id=${targetDir.id}`
            );
            const songDirContent = await got(songDirContentUrl).json();
            const content = (
                songDirContent["subsonic-response"].directory
                    .child as SongDirItem[]
            ).filter((child) => !child.isDir);

            return { status: "received", dir: targetDir, content };
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post("addsongtoplaylist")
    async addSongToPlaylist(
        @Body()
        body: AddSongArg
    ): Promise<AddSongResponse> {
        this.logger.verbose(
            `GET to /api/jukebox/addsongtoplaylist ${JSON.stringify(body)}`
        );

        try {
            const addUrl = this.getAPI(
                "updatePlaylist",
                `&playlistId=${body.playlistId}&songIdToAdd=${body.songId}`
            );

            const response = await got(addUrl).json();

            if (
                !response["subsonic-response"] ||
                response["subsonic-response"].status === "failed"
            ) {
                throw new HttpException(
                    "failed to add song to playlist",
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }

            return { status: "received" };
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
