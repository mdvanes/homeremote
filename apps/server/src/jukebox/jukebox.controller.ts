import {
    ISong,
    PlaylistResponse,
    PlaylistsResponse,
    SongDirItem,
    SongDirResponse,
} from "@homeremote/types";
import {
    Controller,
    Logger,
    UseGuards,
    Get,
    Param,
    StreamableFile,
    Query,
    NotFoundException,
    HttpStatus,
    HttpException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import got from "got";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

const PLAYER_NAME = "HomeRemoteJukebox";

@Controller("api/jukebox")
export class JukeboxController {
    private readonly logger: Logger;
    private readonly baseUrl: string;
    private readonly apiConfig: string;
    private readonly songDirId: string;

    constructor(private configService: ConfigService) {
        this.logger = new Logger(JukeboxController.name);
        this.baseUrl = this.configService.get<string>("JUKEBOX_BASE_URL") || "";
        const JUKEBOX_USERNAME =
            this.configService.get<string>("JUKEBOX_USERNAME") || "";
        const JUKEBOX_SALT =
            this.configService.get<string>("JUKEBOX_SALT") || "";
        const JUKEBOX_API_TOKEN =
            this.configService.get<string>("JUKEBOX_API_TOKEN") || "";
        this.apiConfig = `?u=${JUKEBOX_USERNAME}&t=${JUKEBOX_API_TOKEN}&s=${JUKEBOX_SALT}&v=1.16.0&c=${PLAYER_NAME}&f=json`;

        const JUKEBOX_SONGDIR_ID =
            this.configService.get<string>("JUKEBOX_SONGDIR_ID") || "";
        this.songDirId = JUKEBOX_SONGDIR_ID;
    }

    getAPI(method: string, option = "") {
        return this.baseUrl + method + this.apiConfig + option;
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
            ].playlists.playlist.map(({ id, name }) => ({ id, name }));
            return { status: "received", playlists };
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
    async getPlaylist(@Param("id") id: string): Promise<PlaylistResponse> {
        this.logger.verbose("GET to /api/jukebox/playlist/:id");

        try {
            const url = this.getAPI("getPlaylist", `&id=${id}`);
            const response = await got(url).json();
            const playlist = response["subsonic-response"].playlist;
            const songs = (playlist.entry as ISong[]).map(
                ({ id, artist, title, duration }) => {
                    return {
                        id,
                        artist,
                        title,
                        duration,
                    };
                }
            );

            return { status: "received", songs };
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
        // const getCoverArtUrl = this.getAPI("getCoverArt", `&id=${id}`);

        try {
            const songResponse = await got(getSongUrl).json();

            // NOTE: when getting stream, validate the song id and the artist+title hash
            const { artist, title } = songResponse["subsonic-response"]
                .song as ISong;
            const artistTitle = `${artist} - ${title}`;
            const retrievedHash = btoa(artistTitle);

            if (hash !== retrievedHash) {
                this.logger.error("hashes do not match");
                throw new NotFoundException(HttpStatus.NOT_FOUND);
            }

            // const coverArtResponse = await got(getCoverArtUrl).text();
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
            const songDir = (
                songDirResponse["subsonic-response"].directory
                    .child as SongDirItem[]
            )
                .filter((child) => child.isDir)
                .find((child) => child.title === `${currentYear}`);

            const songDirContentUrl = this.getAPI(
                "getMusicDirectory",
                `&id=${songDir.id}`
            );
            const songDirContent = await got(songDirContentUrl).json();
            const content = (
                songDirContent["subsonic-response"].directory
                    .child as SongDirItem[]
            ).filter((child) => !child.isDir);

            return { status: "received", dir: songDir, content };
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
