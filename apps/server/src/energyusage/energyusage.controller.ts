import {
    EnergyUsageGasItem,
    EnergyUsageGetGasUsageResponse,
    GotGasUsageResponse,
    GotTempResponse,
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
import got from "got";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AuthenticatedRequest } from "../login/LoginRequest.types";

interface SensorConfig {
    name: string;
    type: string;
    idx: string;
}

const strToConfigs = (sensorConfig: string): SensorConfig[] => {
    const sensorStrings = sensorConfig.split(";");

    const sensors = sensorStrings.map((str) => {
        const [name, type, idx] = str.split(",");
        return {
            name,
            type,
            idx,
        };
    });
    return sensors;
};

@Controller("api/energyusage")
export class EnergyUsageController {
    private readonly logger: Logger;
    private readonly apiConfig: {
        baseUrl: string;
        sensors: SensorConfig[];
    };

    constructor(private configService: ConfigService) {
        this.logger = new Logger(EnergyUsageController.name);
        const baseUrl = this.configService.get<string>("DOMOTICZ_URI") || "";
        const DOMOTICZ_SENSORS =
            this.configService.get<string>("DOMOTICZ_SENSORS") || "";
        // console.log(DOMOTICZ_SENSORS);
        this.apiConfig = {
            baseUrl,
            sensors: strToConfigs(DOMOTICZ_SENSORS),
        };
    }

    getAPI(sensorConfig: SensorConfig) {
        return `${this.apiConfig.baseUrl}/json.htm?type=graph&sensor=${sensorConfig.type}&idx=${sensorConfig.idx}&range=month`;
    }

    @UseGuards(JwtAuthGuard)
    @Get("/gas")
    async getNextUp(
        @Request() req: AuthenticatedRequest
    ): Promise<EnergyUsageGetGasUsageResponse> {
        this.logger.verbose(`[${req.user.name}] GET to /api/energyusage/gas`);

        try {
            // const domoticzuri =
            //     this.configService.get<string>("DOMOTICZ_URI") || "";
            const domoticzuri = this.apiConfig.baseUrl;
            console.log(this.apiConfig);

            // NOTE: it's assumed that the first sensor is the baseline, the gas counter

            const [gasSensor, ...temperatureSensors] = this.apiConfig.sensors;

            const gasCounterResponse: GotGasUsageResponse = await got(
                this.getAPI(gasSensor)
            ).json();
            // const gasPromise = temperaturePromises;

            const temperaturePromises = temperatureSensors.map(
                (sensor): Promise<GotTempResponse> => {
                    return got(this.getAPI(sensor)).json();
                }
            );
            // console.log(temperaturePromises);
            const temperatureResponses = await Promise.all<GotTempResponse>(
                temperaturePromises
            );

            /*
            tempInside1Response
            result[] -> {d (day), hu (humidity) string, (numbers:) ta (avg), te (high), tm (low)}
            resultPrev
            */
            const aggregated: EnergyUsageGetGasUsageResponse = {
                ...gasCounterResponse,
                result: gasCounterResponse.result.map((entry, index) => {
                    // const tempInside1Entry = tempInside1Response.result[index];
                    const tempInside1Entry =
                        temperatureResponses[0].result[index];
                    if (tempInside1Entry.d !== entry.d) {
                        throw new Error("days do not match");
                    }
                    // const tempOutside1Entry =
                    //     tempOutside1Response.result[index];
                    const tempOutside1Entry =
                        temperatureResponses[1].result[index];
                    if (tempOutside1Entry.d !== entry.d) {
                        throw new Error("days do not match");
                    }
                    const result: EnergyUsageGasItem = {
                        counter: entry.c,
                        used: entry.v,
                        day: entry.d,
                        temp: {
                            tempInside1: {
                                avg: tempInside1Entry.ta,
                                high: tempInside1Entry.te,
                                low: tempInside1Entry.tm,
                            },
                            tempOutside1: {
                                avg: tempOutside1Entry.ta,
                                high: tempOutside1Entry.te,
                                low: tempOutside1Entry.tm,
                            },
                        },
                    };
                    return result;
                }),
            };
            // console.log(aggregated);

            return aggregated;
        } catch (err) {
            this.logger.error(`[${req.user.name}] ${err}`);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
