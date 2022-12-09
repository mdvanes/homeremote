import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Logger,
    Post,
    Request,
    UseGuards,
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
    @Post()
    async getNextUp(
        @Request() req: AuthenticatedRequest,
        // @Query() query: { batteryToken: string; connectedToken: string }
        // @Req() req:
        @Body() body: { energyToken: string; connectedToken: string }
    ): Promise<{
        result: object;
        doors: object;
        car: object;
        energy: object | undefined;
    }> {
        this.logger.verbose(`[${req.user.name}] GET to /api/cartwin`);

        try {
            // NOTE: it's assumed that the first sensor is the baseline, the gas counter
            // const [gasSensor, ...temperatureSensors] = this.apiConfig.sensors;

            interface VolvoFooResponse {
                foo: any;
            }

            const baseUrl = "https://api.volvocars.com";

            const vin = this.configService.get<string>("CARTWIN_VIN") || "";
            const vccApiKey =
                this.configService.get<string>("CARTWIN_VCC_API_KEY") || "";

            const headers = {
                "vcc-api-key": vccApiKey,
                authorization: `Bearer ${body.connectedToken}`,
                accept: "application/vnd.volvocars.api.connected-vehicle.vehicledata.v1+json",
            };

            const response: VolvoFooResponse = await got(
                // this.getAPI(gasSensor)
                `${baseUrl}/connected-vehicle/v1/vehicles/${vin}/odometer`,
                {
                    headers,
                }
            ).json();
            // this.logger.debug(response);

            const response1: VolvoFooResponse = await got(
                `${baseUrl}/connected-vehicle/v1/vehicles/${vin}/doors`,
                {
                    headers,
                }
            ).json();
            // this.logger.debug(response1);

            const response2: VolvoFooResponse = await got(
                `${baseUrl}/connected-vehicle/v1/vehicles/${vin}`,
                {
                    headers: {
                        ...headers,
                        accept: "application/vnd.volvocars.api.connected-vehicle.vehicle.v1+json",
                    },
                }
            ).json();
            // this.logger.debug(response2);

            const energyResponse: VolvoFooResponse | undefined =
                body.energyToken
                    ? await got(
                          `${baseUrl}/energy/v1/vehicles/${vin}/recharge-status`,
                          {
                              headers: {
                                  ...headers,
                                  authorization: `Bearer ${body.energyToken}`,
                                  accept: "application/vnd.volvocars.api.energy.vehicledata.v1+json",
                              },
                          }
                      ).json()
                    : undefined;
            this.logger.debug(body.energyToken, energyResponse);

            return {
                result: response,
                doors: response1,
                car: response2,
                energy: energyResponse,
            };
        } catch (err) {
            this.logger.error(`[${req.user.name}] ${err}`);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
