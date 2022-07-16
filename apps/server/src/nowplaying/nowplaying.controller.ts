import {
    ChannelName,
    getNowPlaying,
    NowPlayingResponse,
} from "@mdworld/homeremote-stream-player-server";
import {
    Controller,
    Get,
    Headers,
    HttpException,
    HttpStatus,
    Logger,
    UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import got from "got";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("api/nowplaying")
export class NowplayingController {
    private readonly logger: Logger;

    constructor(private configService: ConfigService) {
        this.logger = new Logger(NowplayingController.name);
    }

    @UseGuards(JwtAuthGuard)
    @Get("radio2")
    async getRadio2(): Promise<NowPlayingResponse | undefined> {
        try {
            const response = await getNowPlaying(ChannelName.RADIO2);
            return response;
        } catch (error) {
            this.logger.error(error);
            throw new HttpException(
                error as Error,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Consider using JWT as API instead of random string: https://jwt.io/
    // Do not use use @UseGuards(LocalAuthGuard) like in login.controller. Keep separate authentication with a separate app as a kind of Role Based Access Control
    // Test with `curl -X GET -H "token: 123" http://localhost:4200/api/nowplaying/stereo8/radio2`
    @Get("stereo8/radio2")
    async getStereo8Radio2(
        @Headers() headers: { token?: string }
    ): Promise<NowPlayingResponse | undefined> {
        const notFound = {
            statusCode: HttpStatus.NOT_FOUND,
            message: "Cannot GET /api/nowplaying/stereo8/radio2",
            error: "Not Found",
        };
        const stereo8Token = this.configService.get<string | undefined>(
            "STEREO8_TOKEN"
        );
        if (!stereo8Token) {
            this.logger.error(
                "/stereo8/radio2 called, but token not configured"
            );
            // Emulate an error as if the endpoint does not exist
            throw new HttpException(notFound, HttpStatus.NOT_FOUND);
        } else if (headers.token !== stereo8Token) {
            this.logger.error("/stereo8/radio2 called with invalid token");
            // Emulate an error as if the endpoint does not exist
            throw new HttpException(notFound, HttpStatus.NOT_FOUND);
        }

        this.logger.log("/stereo8/radio2 called with valid token");
        try {
            const response = await getNowPlaying(ChannelName.RADIO2);
            return response;
        } catch (error) {
            this.logger.error(error);
            throw new HttpException(
                error as Error,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("radio2embed")
    async getRadio2Embed(): Promise<string | undefined> {
        try {
            const r = await got("https://www.nporadio2.nl/live").text();
            const match = r.match(
                /https:\/\/start-player\.npo\.nl\/embed\/([^']*)'/
            );
            if (match) {
                const videoStreamEmbedUrl = `https://start-player.npo.nl/embed/${match[1]}`;
                return videoStreamEmbedUrl;
            }
            return "no-reponse";
        } catch (error) {
            this.logger.error(error);
            throw new HttpException(
                error as Error,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("radio3")
    async getRadio3(): Promise<NowPlayingResponse | undefined> {
        try {
            const response = await getNowPlaying(ChannelName.RADIO3);
            return response;
        } catch (error) {
            this.logger.error(error);
            throw new HttpException(
                error as Error,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("sky")
    async getSky(): Promise<NowPlayingResponse | undefined> {
        try {
            const response = await getNowPlaying(ChannelName.SKY);
            return response;
        } catch (error) {
            this.logger.error(error);
            throw new HttpException(
                error as Error,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("pinguin")
    async getPinguin(): Promise<NowPlayingResponse | undefined> {
        try {
            const response = await getNowPlaying(ChannelName.PINGUIN);
            return response;
        } catch (error) {
            this.logger.error(error);
            throw new HttpException(
                error as Error,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
