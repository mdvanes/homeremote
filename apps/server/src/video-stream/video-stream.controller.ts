import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    InternalServerErrorException,
    Logger,
    NotFoundException,
    Query,
    StreamableFile,
    UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import got from "got";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("api/video-stream")
export class VideoStreamController {
    private readonly logger: Logger;

    constructor(private configService: ConfigService) {
        this.logger = new Logger(VideoStreamController.name);
    }

    getEnv(): { hash: string; streamUrl: string } {
        const hash = this.configService.get<string>("VIDEO_STREAM_HASH") || "";
        const streamUrl =
            this.configService.get<string>("VIDEO_STREAM_URL") || "";
        return { hash, streamUrl };
    }

    @UseGuards(JwtAuthGuard)
    @Get("/hash")
    async getHash(): Promise<{ hash: string }> {
        this.logger.verbose("HEAD to api/video-stream");

        const { hash, streamUrl } = this.getEnv();

        try {
            if (hash === "") {
                this.logger.error("VIDEO_STREAM_HASH is unset");
                throw new NotFoundException(HttpStatus.NOT_FOUND);
            }

            const headResponse = await got.head(streamUrl);
            if (headResponse.statusCode !== 200) {
                throw new InternalServerErrorException(
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
            return { hash: hash };
        } catch (error) {
            this.logger.error(error);
            throw new HttpException(
                error as Error,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get()
    async getVideoStream(@Query("hash") hash: string): Promise<StreamableFile> {
        this.logger.verbose("GET to api/video-stream");

        const env = this.getEnv();

        try {
            if (hash !== env.hash) {
                this.logger.error("VIDEO_STREAM_HASH does not match");
                throw new NotFoundException(HttpStatus.NOT_FOUND);
            }

            const stream$ = got.stream(env.streamUrl);
            return new StreamableFile(stream$);
        } catch (error) {
            this.logger.error(error);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
