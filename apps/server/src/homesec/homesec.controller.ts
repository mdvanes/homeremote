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
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AuthenticatedRequest } from "../login/LoginRequest.types";
import got from "got";
import {
    HomesecDevicesResponse,
    HomesecPanelResponse,
} from "@homeremote/types";

@Controller("api/homesec")
export class HomesecController {
    private readonly logger: Logger;
    private readonly baseUrl: string;
    private readonly username: string;
    private readonly password: string;

    constructor(private configService: ConfigService) {
        this.logger = new Logger(HomesecController.name);
        this.baseUrl = this.configService.get<string>("HOMESEC_BASE_URL") || "";
        this.username =
            this.configService.get<string>("HOMESEC_USERNAME") || "";
        this.password =
            this.configService.get<string>("HOMESEC_PASSWORD") || "";
    }

    @UseGuards(JwtAuthGuard)
    @Get("devices")
    async getDevices(
        @Request() req: AuthenticatedRequest
    ): Promise<HomesecDevicesResponse> {
        this.logger.verbose(`[${req.user.name}] GET to /api/homesec/devices`);

        try {
            const url = `${this.baseUrl}/action/deviceListGet`;

            const response1: HomesecPanelResponse = await got(
                `${this.baseUrl}/action/panelCondGet`,
                {
                    username: this.username,
                    password: this.password,
                }
            ).json();
            this.logger.log(response1);

            const response: HomesecDevicesResponse = await got(url, {
                username: this.username,
                password: this.password,
            }).json();
            // TODO this.logger.log(response);
            return response;
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
