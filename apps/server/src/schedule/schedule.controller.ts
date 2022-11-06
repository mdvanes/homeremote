import { GetScheduleResponse } from "@homeremote/types";
import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    Request,
    UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import got from "got";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AuthenticatedRequest } from "../login/LoginRequest.types";

@Controller("api/schedule")
export class ScheduleController {
    private readonly logger: Logger;

    constructor(private configService: ConfigService) {
        this.logger = new Logger(ScheduleController.name);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getSchedule(
        @Request() req: AuthenticatedRequest
    ): Promise<GetScheduleResponse> {
        this.logger.verbose(`[${req.user.name}] GET to /api/schedule`);

        // Get the API from host:port/apibuilder/
        const SCHEDULE_URL =
            this.configService.get<string>("SCHEDULE_URL") || "";

        try {
            const url = `${SCHEDULE_URL}/?cmd=future`;
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
}
