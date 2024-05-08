import type {
    EnergyUsageGasItem,
    EnergyUsageGetElectricExportsResponse,
    EnergyUsageGetGasUsageResponse,
    EnergyUsageGetTemperatureResponse,
    EnergyUsageGetWaterResponse,
    GasUsageItem,
    GetDomoticzJsonExport,
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
import { readFile, readdir } from "fs/promises";
import got from "got";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AuthenticatedRequest } from "../login/LoginRequest.types";

interface SensorConfig {
    name: string;
    type: string;
    idx: string;
}

const DAY = 1000 * 60 * 60 * 24;
const MONTH = 1000 * 60 * 60 * 24 * 30;

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
        @Request() req: AuthenticatedRequest,
        @Query("range") range: "day" | "month"
    ): Promise<EnergyUsageGetTemperatureResponse> {
        this.logger.verbose(
            `[${req.user.name}] GET to /api/energyusage/temperature`
        );

        try {
            const time = Date.now();
            const startOffset = range === "month" ? MONTH : DAY;
            const startTime = new Date(time - startOffset).toISOString();
            const endTime = new Date(time).toISOString();

            const url = `${this.haApiConfig.baseUrl}/api/history/period/${startTime}?end_time=${endTime}&filter_entity_id=${this.haApiConfig.temperatureSensorId}`;

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

        try {
            // TODO The API call crashes when the startDate is too far into the past. At this time 2024-04-30 is the earliest that works. Docs: https://developers.home-assistant.io/docs/api/rest/

            const time = Date.now();
            const startOffset = range === "month" ? MONTH : DAY;
            const startTime = new Date(time - startOffset).toISOString();
            const endTime = new Date(time).toISOString();

            const url = `${this.haApiConfig.baseUrl}/api/history/period/${startTime}?end_time=${endTime}&filter_entity_id=${this.haApiConfig.waterSensorId}&minimal_response`;

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
    @Get("/electric/exports")
    async getElectricExports(
        @Request() req: AuthenticatedRequest,
        @Query("range") range: "day" | "month"
    ): Promise<EnergyUsageGetElectricExportsResponse> {
        this.logger.verbose(
            `[${req.user.name}] GET to /api/energyusage/electric/exports`
        );

        try {
            const filesInDir = await readdir("./tmp");
            this.logger.verbose(filesInDir);

            /* needed per file:

day of week | date | time1 / usage | time2 / usage | etc.

            - include or exclude manually
            - then aggregate from date x to date y.
            - get average for weekday/weekend

            */

            /*
            {
	"result" : 
	[
		{
			"d" : "2024-04-14 05:30",
			"eu" : "1719",
			"r1" : "0",
			"r2" : "0",
			"v" : "0",
			"v2" : "0"
		},
            */

            const usagePerDay: EnergyUsageGetElectricExportsResponse =
                await Promise.all(
                    filesInDir.map<
                        Promise<EnergyUsageGetElectricExportsResponse[0]>
                    >(async (fileInDir) => {
                        const fileContents = await readFile(
                            `./tmp/${fileInDir}`,
                            "utf-8"
                        );
                        const fileJson: GetDomoticzJsonExport =
                            JSON.parse(fileContents);
                        // console.log(fileInDir, fileJson.result[0]);
                        const firstItem = fileJson.result[0];
                        const day = new Date(firstItem.d.slice(0, 10));
                        // console.log(date);
                        const result: EnergyUsageGetElectricExportsResponse[0] =
                            {
                                exportName: fileInDir,
                                date: day.toISOString(),
                                dateMillis: day.getTime(),
                                dayOfWeek: day.toLocaleDateString("en-GB", {
                                    weekday: "long",
                                }),
                                entries: fileJson.result.map((entry) => ({
                                    time: entry.d,
                                    v: parseInt(entry.v) + parseInt(entry.v2),
                                    v1: parseInt(entry.v),
                                    v2: parseInt(entry.v2),
                                })),
                            };
                        // console.log(result);
                        return result;
                    })
                );
            console.log(usagePerDay);

            // const fileContents = await readFile(
            //     `./tmp/${filesInDir[0]}`,
            //     "utf-8"
            // );
            // const fileJson: GetDomoticzJsonExport = JSON.parse(fileContents);

            // console.log(fileJson);

            return usagePerDay;

            // const result = filesInDir.map<
            //     EnergyUsageGetElectricExportsResponse[0]
            // >((n) => ({
            //     exportName: n,
            //     date: "",
            //     dayOfWeek: "Monday",
            //     entries: [
            //         {
            //             time: "05:30",
            //             v1: 123,
            //             v2: 456,
            //             v: 123 + 456,
            //         },
            //     ],
            // }));

            // return result;
        } catch (err) {
            this.logger.error(`[${req.user.name}] ${err}`);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
