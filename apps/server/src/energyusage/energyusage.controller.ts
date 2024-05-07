import type {
    EnergyUsageGasItem,
    EnergyUsageGetGasUsageResponse,
    EnergyUsageGetTemperatureResponse,
    EnergyUsageGetWaterResponse,
    GasUsageItem,
    GetHaSensorHistoryResponse,
    GotGasUsageResponse,
    GotTempResponse,
} from "@homeremote/types";
import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    Query,
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
    (temperatureSensors: SensorConfig[], date: string) =>
    (response: GotTempResponse, temperatureIndex: number) => {
        const sensor = temperatureSensors[temperatureIndex];
        const temperatureEntry = response.result.find((r) => r.d === date);
        return [
            sensor.name,
            {
                avg: temperatureEntry?.ta ?? "",
                high: temperatureEntry?.te ?? "",
                low: temperatureEntry?.tm ?? "",
            },
        ];
    };

const sensorResultsToAggregated =
    (
        gasEntries: GasUsageItem[],
        temperatureSensors: SensorConfig[],
        temperatureResponses: GotTempResponse[]
    ) =>
    (date: string) => {
        const temperatureEntries = temperatureResponses.map(
            temperatureResponseToEntry(temperatureSensors, date)
        );
        const gasEntry = gasEntries.find((r) => r.d === date);

        const result: EnergyUsageGasItem = {
            day: date,
            counter: gasEntry?.c ?? "",
            used: gasEntry?.v ?? "",

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
    private readonly haApiConfig: {
        baseUrl: string;
        token: string;
        temperatureSensorId: string;
        waterSensorId: string;
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
        this.haApiConfig = {
            baseUrl:
                this.configService.get<string>("HOMEASSISTANT_BASE_URL") || "",
            token: this.configService.get<string>("HOMEASSISTANT_TOKEN") || "",
            temperatureSensorId:
                this.configService.get<string>(
                    "HOMEASSISTANT_TEMPERATURE_SENSOR_ID"
                ) || "",
            waterSensorId:
                this.configService.get<string>(
                    "HOMEASSISTANT_WATER_SENSOR_ID"
                ) || "",
        };
    }

    getAPI(sensorConfig: SensorConfig) {
        return `${this.apiConfig.baseUrl}/json.htm?type=graph&sensor=${sensorConfig.type}&idx=${sensorConfig.idx}&range=month`;
    }

    @UseGuards(JwtAuthGuard)
    @Get("/gas")
    async getGas(
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

            const now = Date.now();
            const NR_OF_DAYS = 31;
            const lastMonth = new Date(now - 1000 * 60 * 60 * 24 * NR_OF_DAYS);
            const dateRange = new Array(NR_OF_DAYS)
                .fill(0)
                .map((n, index) =>
                    new Date(
                        lastMonth.getTime() + 1000 * 60 * 60 * 24 * (index + 1)
                    )
                        .toISOString()
                        .slice(0, 10)
                );
            const aggregated: EnergyUsageGetGasUsageResponse = {
                ...gasCounterResponse,
                result: dateRange.map(
                    sensorResultsToAggregated(
                        gasCounterResponse.result,
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

    @UseGuards(JwtAuthGuard)
    @Get("/temperature")
    async getTemperature(
        @Request() req: AuthenticatedRequest
    ): Promise<EnergyUsageGetTemperatureResponse> {
        this.logger.verbose(
            `[${req.user.name}] GET to /api/energyusage/temperature`
        );

        try {
            const date = new Date().toISOString().slice(0, 10);
            const url = `${this.haApiConfig.baseUrl}/api/history/period/${date}T00:00:00Z?filter_entity_id=${this.haApiConfig.temperatureSensorId}`;

            const result = await got(url, {
                headers: {
                    Authorization: `Bearer ${this.haApiConfig.token}`,
                },
            }).json<GetHaSensorHistoryResponse>();

            return result;
        } catch (err) {
            this.logger.error(`[${req.user.name}] ${err}`);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("/water")
    async getWater(
        @Request() req: AuthenticatedRequest,
        @Query("range") range: "day" | "month"
    ): Promise<EnergyUsageGetWaterResponse> {
        this.logger.verbose(`[${req.user.name}] GET to /api/energyusage/water`);

        // const mode: "day" | "month" = "month".toString() as "day" | "month";

        // See https://developers.home-assistant.io/docs/api/rest/
        try {
            // crashes
            // const date = new Date("2024-04-29").toISOString().slice(0, 10);
            // earliest date that works, but show only 24 hours
            // const date = new Date("2024-04-30").toISOString().slice(0, 10);
            const startDate = new Date(
                range === "month" ? "2024-05-01" : Date.now()
            )
                .toISOString()
                .slice(0, 10);
            this.logger.verbose(startDate);
            const tomorrow = new Date(Date.now() + 1000 * 60 * 60 * 24)
                .toISOString()
                .slice(0, 10);
            const url = `${this.haApiConfig.baseUrl}/api/history/period/${startDate}T00:00:00Z?end_time=${tomorrow}T00:00:00Z&filter_entity_id=${this.haApiConfig.waterSensorId}&minimal_response`;

            // Default: 1 day from the selected date
            // const date = new Date().toISOString().slice(0, 10);
            // const url = `${this.haApiConfig.baseUrl}/api/history/period/${date}T00:00:00Z?filter_entity_id=${this.haApiConfig.waterSensorId}`;

            const result = await got(url, {
                headers: {
                    Authorization: `Bearer ${this.haApiConfig.token}`,
                },
            }).json<GetHaSensorHistoryResponse>();

            return result;
        } catch (err) {
            this.logger.error(`[${req.user.name}] ${err}`);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
