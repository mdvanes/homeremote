import { ISong, PlaylistResponse, PlaylistsResponse } from "@homeremote/types";
import {
    Controller,
    Logger,
    UseGuards,
    Get,
    Param,
    StreamableFile,
    Query,
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
            return { status: "error" };
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
                        // url:
                        //     "https://xxxxxxx" +
                        //     this.getAPI("stream", `&id=${id}`).slice(23),
                    };
                }
            );
            // console.log(
            //     playlist,
            //     playlist.entry,
            //     this.getAPI("stream", `&id=1`)
            // );
            // console.log(songs);
            return { status: "received", songs };
        } catch (err) {
            this.logger.error(err);
            return { status: "error" };
        }
    }

    // TODO when getting stream, validate the song id and the artist+title hash
    @Get("song/:id")
    getSong(
        @Param("id") id: string,
        @Query("hash") hash: string
    ): StreamableFile {
        this.logger.verbose("GET to /api/jukebox/song/:id");
        // const getSongUrl = this.getAPI("getSong", `&id=${id}`);
        // const getCoverArtUrl = this.getAPI("getCoverArt", `&id=${id}`);

        // const test = async () => {
        //     const song = await got(getSongUrl).json();
        //     const coverArt = await got(getCoverArtUrl).json();

        //     console.log(
        //         id,
        //         hash,
        //         atob(hash),
        //         "songinfo",
        //         song,
        //         "coverArt",
        //         coverArt
        //     );
        // };
        // test();

        const streamUrl = this.getAPI("stream", `&id=${id}`);
        const str = got.stream(streamUrl);
        return new StreamableFile(str);
    }
}
