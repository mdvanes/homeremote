import {
    Controller,
    Get,
    Logger,
    UseGuards,
    Request,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import got from "got/dist/source";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AuthenticatedRequest } from "../login/LoginRequest.types";

@Controller("api/cartwin")
export class CarTwinController {
    private readonly logger: Logger;
    // private readonly apiConfig: {
    //     baseUrl: string;
    //     sensors: SensorConfig[];
    // };

    constructor(private configService: ConfigService) {
        this.logger = new Logger(CarTwinController.name);
        // const baseUrl = this.configService.get<string>("DOMOTICZ_URI") || "";
        // const DOMOTICZ_SENSORS =
        //     this.configService.get<string>("DOMOTICZ_SENSORS") || "";
        // this.apiConfig = {
        //     baseUrl,
        //     sensors: strToConfigs(DOMOTICZ_SENSORS),
        // };
    }

    // getAPI(sensorConfig: SensorConfig) {
    //     return `${this.apiConfig.baseUrl}/json.htm?type=graph&sensor=${sensorConfig.type}&idx=${sensorConfig.idx}&range=month`;
    // }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getNextUp(
        @Request() req: AuthenticatedRequest
    ): Promise<{ result: object }> {
        this.logger.verbose(`[${req.user.name}] GET to /api/cartwin`);

        try {
            // NOTE: it's assumed that the first sensor is the baseline, the gas counter
            // const [gasSensor, ...temperatureSensors] = this.apiConfig.sensors;

            interface VolvoFooResponse {
                foo: any;
            }

            const gasCounterResponse: VolvoFooResponse = await got(
                // this.getAPI(gasSensor)
                ""
            ).json();
            return { result: {} };
        } catch (err) {
            this.logger.error(`[${req.user.name}] ${err}`);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
