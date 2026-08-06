import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    Query,
    StreamableFile,
    UseGuards,
} from "@nestjs/common";
import got from "got";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import {
    isAllowedUpstreamHost,
    looksLikePlaylist,
    resolveManifestUrl,
    rewriteManifest,
} from "./video-stream.npo";

const MANIFEST_CONTENT_TYPE = "application/vnd.apple.mpegurl";
const PROXY_PATH = "/api/video-stream/proxy";

@Controller("api/video-stream")
export class VideoStreamController {
    private readonly logger: Logger;

    constructor() {
        this.logger = new Logger(VideoStreamController.name);
    }

    @UseGuards(JwtAuthGuard)
    @Get("manifest.m3u8")
    async getManifest(): Promise<StreamableFile> {
        this.logger.verbose("GET to api/video-stream/manifest.m3u8");

        try {
            const manifestUrl = await resolveManifestUrl();
            const manifestText = await got(manifestUrl).text();
            const rewritten = rewriteManifest(
                manifestText,
                manifestUrl,
                PROXY_PATH
            );
            return new StreamableFile(Buffer.from(rewritten), {
                type: MANIFEST_CONTENT_TYPE,
            });
        } catch (error) {
            this.logger.error(error);
            throw new HttpException(
                "failed to resolve video stream manifest",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("proxy")
    async getProxiedResource(
        @Query("url") url: string
    ): Promise<StreamableFile> {
        this.logger.verbose(`GET to api/video-stream/proxy ${url}`);

        if (!url || !isAllowedUpstreamHost(url)) {
            this.logger.error(`Disallowed upstream host for url: ${url}`);
            throw new HttpException(
                "upstream host not allowed",
                HttpStatus.FORBIDDEN
            );
        }

        try {
            if (looksLikePlaylist(url)) {
                const manifestText = await got(url).text();
                const rewritten = rewriteManifest(
                    manifestText,
                    url,
                    PROXY_PATH
                );
                return new StreamableFile(Buffer.from(rewritten), {
                    type: MANIFEST_CONTENT_TYPE,
                });
            }

            const upstream = got.stream(url);
            return new StreamableFile(upstream);
        } catch (error) {
            this.logger.error(error);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
