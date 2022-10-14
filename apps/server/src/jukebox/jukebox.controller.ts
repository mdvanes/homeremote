import { Controller, Logger, UseGuards, Get, Param } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import got from "got";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("api/jukebox")
export class JukeboxController {
    private readonly logger: Logger;

    constructor(private configService: ConfigService) {
        this.logger = new Logger(JukeboxController.name);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getDockerList(): Promise<any> {
        this.logger.verbose("GET to /api/jukebox");

        const PLAYER_NAME = "HomeRemoteJukebox";

        const JUKEBOX_BASE_URL =
            this.configService.get<string>("JUKEBOX_BASE_URL") || "";
        const JUKEBOX_USERNAME =
            this.configService.get<string>("JUKEBOX_USERNAME") || "";
        const JUKEBOX_SALT =
            this.configService.get<string>("JUKEBOX_SALT") || "";
        const JUKEBOX_API_TOKEN =
            this.configService.get<string>("JUKEBOX_API_TOKEN") || "";

        const API_CONFIG = `?u=${JUKEBOX_USERNAME}&t=${JUKEBOX_API_TOKEN}&s=${JUKEBOX_SALT}&v=1.16.0&c=${PLAYER_NAME}&f=json`;

        const getAPI = (method: string, option = "") =>
            JUKEBOX_BASE_URL + method + API_CONFIG + option;

        try {
            const url = getAPI("getPlaylists");
            const response = await got(url).json();
            const x = response["subsonic-response"].playlists.playlist.map(
                ({ id, name }) => ({ id, name })
            );
            // console.log(x);
            return { status: "received", playlists: x };
        } catch (err) {
            this.logger.error(err);
            return { status: "error" };
        }
    }
}

