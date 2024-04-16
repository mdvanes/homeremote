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
import { wait } from "../util/wait";

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
    async getStatus(
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
            const status = panelResponse.updates.mode_a1;

            try {
                await wait(5000);
                const devicesResponse: HomesecDevicesResponse = await got(
                    `${this.baseUrl}/action/deviceListGet`,
                    {
                        username: this.username,
                        password: this.password,
                    }
                ).json();

                return {
                    status,
                    devices: devicesResponse.senrows.map(
                        ({ id, name, type_f, status, rssi, cond_ok }) => ({
                            id,
                            name,
                            type_f,
                            status,
                            rssi,
                            cond_ok,
                        })
                    ),
                };
            } catch (err) {
                this.logger.error("deviceListGet:", err);
                return {
                    status,
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
