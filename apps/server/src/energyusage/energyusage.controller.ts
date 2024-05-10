import type {
    EnergyUsageGasItem,
    EnergyUsageGetElectricExportsResponse,
    EnergyUsageGetGasUsageResponse,
    EnergyUsageGetTemperatureResponse,
    EnergyUsageGetWaterResponse,
    GasUsageItem,
    GetDomoticzJsonExport,
    GetDomoticzUsePerDayResponse,
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
import { isDefined } from "../util/isDefined";

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

const findUsePerDayTotalByDate = (
    total: GetDomoticzUsePerDayResponse["result"],
    date: string
) => {
    return total.find((e) => e.d === date);
};

const OFFSET = 19800000 - 1000 * 60 * 60; // 5:30 in millis
const TIMEPOINTS = new Array(288)
    .fill(0)
    .map((n, i) => OFFSET + 1000 * 60 * 5 * i)
    .map((n) =>
        new Date(n).toLocaleTimeString("nl-NL", {
            hour: "2-digit",
            minute: "2-digit",
        })
    );

const getNormalizedEntries =
    (jsonExport: GetDomoticzJsonExport) => (timepoint: string) => {
        const match = jsonExport.result.find(
            (item: { d: string; v: string; v2: string }) =>
                item.d.slice(-5) === timepoint
        );
        if (!match) {
            return {
                d: timepoint,
                v: undefined,
            };
        }
        const v1 = parseInt(match.v);
        const v2 = parseInt(match.v2);
        const v = v1 + v2;
        return {
            time: match.d,
            v,
            v1,
            v2,
        };
    };

const getDayUsage = (
    day: Date,
    usePerDayTotals: GetDomoticzUsePerDayResponse["result"]
): number | undefined => {
    const yearMonthDay = day.toISOString().slice(0, 10);
    try {
        const dayUsageDay = findUsePerDayTotalByDate(
            usePerDayTotals,
            yearMonthDay
        );
        const dayUsage = parseFloat(dayUsageDay.v) + parseFloat(dayUsageDay.v2);
        // console.log("dayUsage1", dayUsage, yearMonthDay, dayUsageDay, day);
        return dayUsage;
    } catch (err) {
        console.log(`Can't get dayUsage for ${yearMonthDay}`);
        return undefined;
    }
};

// exportJsonToRow
const exportJsonToRow =
    (usePerDayTotals: GetDomoticzUsePerDayResponse["result"]) =>
    async (
        fileInDir: string
    ): Promise<EnergyUsageGetElectricExportsResponse[0] | undefined> => {
        const fileContents = await readFile(`./tmp/${fileInDir}`, "utf-8");
        try {
            const fileJson: GetDomoticzJsonExport = JSON.parse(fileContents);
            const firstItem = fileJson.result[0];
            const day = new Date(firstItem.d.slice(0, 10));

            // Align supplied entries to exact timepoints
            const normalizedEntries = TIMEPOINTS.map(
                getNormalizedEntries(fileJson)
            );

            const dayUsage = getDayUsage(day, usePerDayTotals);

            const result: EnergyUsageGetElectricExportsResponse[0] = {
                exportName: fileInDir,
                date: day.toISOString(),
                dateMillis: day.getTime(),
                dayOfWeek: day.toLocaleDateString("en-GB", {
                    weekday: "long",
                }),
                dayUsage,
                entries: normalizedEntries,
            };

            return result;
        } catch (err) {
            console.log(`Can't process ${fileInDir}`);
            return undefined;
        }
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
        @Request() req: AuthenticatedRequest
        // @Query("range") range: "day" | "month"
    ): Promise<EnergyUsageGetElectricExportsResponse> {
        this.logger.verbose(
            `[${req.user.name}] GET to /api/energyusage/electric/exports`
        );

        try {
            const filesInDir = await readdir("./tmp");

            this.logger.verbose(`[${req.user.name}] start get counter`);

            // TODO make idx and actyear dynamic
            const electricCounterResponseYear1: GetDomoticzUsePerDayResponse =
                await got(
                    `${this.apiConfig.baseUrl}/json.htm?type=graph&sensor=counter&idx=2071&range=year&actyear=2023`
                ).json();
            const electricCounterResponseYear2: GetDomoticzUsePerDayResponse =
                await got(
                    `${this.apiConfig.baseUrl}/json.htm?type=graph&sensor=counter&idx=2071&range=year&actyear=2024`
                ).json();

            // this.logger.verbose(
            //     `[${req.user.name}] end get counter`,
            //     electricCounterResponseYear1.result.length,
            //     electricCounterResponseYear1.result.at(0),
            //     electricCounterResponseYear1.result.at(-1),
            //     electricCounterResponseYear2.result.length,
            //     electricCounterResponseYear2.result.at(0),
            //     electricCounterResponseYear2.result.at(-1)
            // );
            const usePerDayTotals = electricCounterResponseYear1.result.concat(
                electricCounterResponseYear2.result
            );

            const usagePerDay: EnergyUsageGetElectricExportsResponse =
                await Promise.all(
                    filesInDir.map<
                        Promise<EnergyUsageGetElectricExportsResponse[0]>
                    >(exportJsonToRow(usePerDayTotals))
                );

            return usagePerDay.filter(isDefined);
        } catch (err) {
            this.logger.error(`[${req.user.name}] ${err}`);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
