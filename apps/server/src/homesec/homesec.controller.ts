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
    HomesecStatusResponse,
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
    @Get("status")
    async getDevices(
        @Request() req: AuthenticatedRequest
    ): Promise<HomesecStatusResponse> {
        this.logger.verbose(`[${req.user.name}] GET to /api/homesec/devices`);

        try {
            const panelResponse: HomesecPanelResponse = await got(
                `${this.baseUrl}/action/panelCondGet`,
                {
                    username: this.username,
                    password: this.password,
                }
            ).json();
            this.logger.log(panelResponse);

            try {
                const devicesResponse: HomesecDevicesResponse = await got(
                    `${this.baseUrl}/action/deviceListGet`,
                    {
                        username: this.username,
                        password: this.password,
                    }
                ).json();
                this.logger.log(devicesResponse);
                return {
                    status: panelResponse.updates.mode_a1,
                    devices: devicesResponse.senrows.map(
                        ({ id, name, type_f, status, rssi }) => ({
                            id,
                            name,
                            type_f,
                            status,
                            rssi,
                        })
                    ),
                };
            } catch (err) {
                this.logger.error("deviceListGet:", err);
                return {
                    status: panelResponse.updates.mode_a1,
                    devices: [],
                };
            }
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
