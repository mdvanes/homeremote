import { GetScheduleResponse } from "@homeremote/types";
import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    Param,
    Request,
    StreamableFile,
    UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import got from "got";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AuthenticatedRequest } from "../login/LoginRequest.types";

@Controller("api/schedule")
export class ScheduleController {
    private readonly logger: Logger;
    private readonly SCHEDULE_URL: string;

    constructor(private configService: ConfigService) {
        this.logger = new Logger(ScheduleController.name);

        // Get the API from host:port/apibuilder/
        this.SCHEDULE_URL =
            this.configService.get<string>("SCHEDULE_URL") || "";
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getSchedule(
        @Request() req: AuthenticatedRequest
    ): Promise<GetScheduleResponse> {
        this.logger.verbose(`[${req.user.name}] GET to /api/schedule`);

        try {
            const url = `${this.SCHEDULE_URL}/?cmd=future`;
            const response: GetScheduleResponse = await got(url).json();
            return response;
        } catch (err) {
            this.logger.error(`[${req.user.name}] ${err}`);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("thumbnail/:id")
    async getThumbnail(
        @Param("id") id: string,
        @Request() req: AuthenticatedRequest
    ): Promise<StreamableFile> {
        this.logger.verbose(
            `[${req.user.name}] GET to /api/schedule/thumbnail/:id ${id}`
        );

        try {
            const streamUrl = `${this.SCHEDULE_URL}/?cmd=show.getbanner&indexerid=${id}&media_format=thumb`;

            const str = got.stream(streamUrl);
            return new StreamableFile(str);
        } catch (err) {
            this.logger.error(`[${req.user.name}] ${err}`);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
