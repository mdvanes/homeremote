import {
    ChannelName,
    getNowPlaying,
    NowPlayingResponse,
} from "@mdworld/homeremote-stream-player-server";
import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import got from "got";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { getRadioMetaData } from "@mdworld/radio-metadata";
import { RadioMetadata } from "@mdworld/radio-metadata/lib/radio-metadata.types";

interface PreviouslyResponse extends NowPlayingResponse {
    broadcast: RadioMetadata["broadcast"];
    time: RadioMetadata["time"];
    listenUrl: RadioMetadata["song"]["listenUrl"];
}

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
    /* @Get("stereo8/radio2")
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
    } */

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

    // TODO remove "type": "module" from radio-metadata package.json
    @UseGuards(JwtAuthGuard)
    @Get("radio2previously")
    async getRadio2Previously(): Promise<PreviouslyResponse[] | undefined> {
        const origFetch = global.fetch;
        // @ts-expect-error hacky polyfill for Fetch API with Got
        global.fetch = async (url: string) => {
            const responseJson = await got(url).json();
            return { json: async () => responseJson };
        };

        try {
            const tracks = await getRadioMetaData("npo2");

            // Restore after polyfill is used
            global.fetch = origFetch;

            const lastUpdated = Date.now().toString();

            return tracks.map((track) => ({
                artist: track.song.artist,
                title: track.song.title,
                name: track.broadcast.title,
                imageUrl: track.broadcast.imageUrl,
                last_updated: lastUpdated,
                songImageUrl: track.song.imageUrl,
                listenUrl: track.song.listenUrl,
                broadcast: track.broadcast,
                time: track.time,
            }));
        } catch (error) {
            // Restore after polyfill is used
            global.fetch = origFetch;

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
