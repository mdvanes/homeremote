import {
    Controller,
    Get,
    Logger,
    UseGuards,
    Request,
    HttpException,
    HttpStatus,
    Query,
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
        @Request() req: AuthenticatedRequest,
        @Query() query: { batteryToken: string; connectedToken: string }
    ): Promise<{ result: object }> {
        this.logger.verbose(`[${req.user.name}] GET to /api/cartwin`);

        try {
            // NOTE: it's assumed that the first sensor is the baseline, the gas counter
            // const [gasSensor, ...temperatureSensors] = this.apiConfig.sensors;

            interface VolvoFooResponse {
                foo: any;
            }

            const baseUrl = "https://api.volvocars.com/";

            const vin = this.configService.get<string>("CARTWIN_VIN") || "";
            const vccApiKey =
                this.configService.get<string>("CARTWIN_VCC_API_KEY") || "";

            const response: VolvoFooResponse = await got(
                // this.getAPI(gasSensor)
                `${baseUrl}/connected-vehicle/v1/vehicles/${vin}/odometer`,
                {
                    headers: {
                        "vcc-api-key": vccApiKey,
                        authorization: `Bearer ${query.connectedToken}`,
                    },
                }
            ).json();
            this.logger.debug(response);
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
