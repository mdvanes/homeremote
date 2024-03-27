import {
    EnergyUsageGasItem,
    EnergyUsageGetGasUsageResponse,
    GasUsageItem,
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

const temperatureResponseToEntry =
    (temperatureSensors: SensorConfig[], index: number) =>
    (response: GotTempResponse, temperatureIndex: number) => {
        const sensor = temperatureSensors[temperatureIndex];
        const temperatureEntry = response.result[index];
        if (!temperatureEntry) {
            return [
                sensor.name,
                {
                    avg: undefined,
                    high: undefined,
                    low: undefined,
                },
            ];
        }
        if (temperatureEntry.d !== temperatureEntry.d) {
            throw new Error("days do not match");
        }
        return [
            sensor.name,
            {
                avg: temperatureEntry.ta,
                high: temperatureEntry.te,
                low: temperatureEntry.tm,
            },
        ];
    };

const sensorResultsToAggregated =
    (
        temperatureSensors: SensorConfig[],
        temperatureResponses: GotTempResponse[]
    ) =>
    (gasEntry: GasUsageItem, index: number) => {
        const temperatureEntries = temperatureResponses.map(
            temperatureResponseToEntry(temperatureSensors, index)
        );

        const result: EnergyUsageGasItem = {
            counter: gasEntry.c,
            used: gasEntry.v,
            day: gasEntry.d,
            temp: Object.fromEntries(temperatureEntries),
        };
        return result;
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
            // NOTE: it's assumed that the first sensor is the baseline, the gas counter
            const [gasSensor, ...temperatureSensors] = this.apiConfig.sensors;

            const gasCounterResponse: GotGasUsageResponse = await got(
                this.getAPI(gasSensor)
            ).json();

            const temperaturePromises = temperatureSensors.map(
                (sensor): Promise<GotTempResponse> => {
                    return got(this.getAPI(sensor)).json();
                }
            );
            const temperatureResponses = await Promise.all<GotTempResponse>(
                temperaturePromises
            );

            const aggregated: EnergyUsageGetGasUsageResponse = {
                ...gasCounterResponse,
                result: gasCounterResponse.result.map(
                    sensorResultsToAggregated(
                        temperatureSensors,
                        temperatureResponses
                    )
                ),
            };

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
