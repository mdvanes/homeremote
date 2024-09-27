import {
    GetSpeedTestResponse,
    GetSpeedTestTrackerResponse,
    type SmartEntitiesTypes,
} from "@homeremote/types";
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

@Controller("api/speedtest")
export class SpeedtestController {
    private readonly logger: Logger;

    private readonly haApiConfig: {
        baseUrl: string;
        token: string;
        entityId: string;
    };

    constructor(private configService: ConfigService) {
        this.logger = new Logger(SpeedtestController.name);

        this.haApiConfig = {
            baseUrl:
                this.configService.get<string>("HOMEASSISTANT_BASE_URL") || "",
            token: this.configService.get<string>("HOMEASSISTANT_TOKEN") || "",
            entityId:
                this.configService.get<string>("HOMEASSISTANT_SWITCHES_ID") ||
                "",
        };
    }

    async fetchHa<T>(path: string): Promise<T> {
        const response = await fetch(`${this.haApiConfig.baseUrl}${path}`, {
            headers: {
                Authorization: `Bearer ${this.haApiConfig.token}`,
            },
        });
        return response.json() as T;
    }

    async fetchHaEntityState(
        entityId: string
    ): Promise<SmartEntitiesTypes.GetSmartEntitiesResponse> {
        return this.fetchHa<SmartEntitiesTypes.GetSmartEntitiesResponse>(
            `/api/states/${entityId}`
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get("/latest")
    async getLatestSpeedtest(
        @Request() req: AuthenticatedRequest
    ): Promise<GetSpeedTestResponse> {
        this.logger.verbose(`[${req.user.name}] GET to /speedtest/latest`);

        try {
            const response = await fetch(
                `http://192.168.0.8:8089/api/speedtest/latest`
            );
            const data = (await response.json()) as GetSpeedTestTrackerResponse;

            return data;
        } catch (err) {
            this.logger.error(`[${req.user.name}] ${err}`);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
