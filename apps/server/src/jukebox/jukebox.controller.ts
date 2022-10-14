import { PlaylistsResponse } from "@homeremote/types";
import { Controller, Logger, UseGuards, Get, Param } from "@nestjs/common";
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
    @Get()
    async getDockerList(): Promise<PlaylistsResponse> {
        this.logger.verbose("GET to /api/jukebox");

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
}
