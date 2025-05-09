import type {
    EnergyUsageGasItem,
    EnergyUsageGetElectricExportsResponse,
    EnergyUsageGetElectricResponse,
    EnergyUsageGetGasTemperatureQueryParams,
    EnergyUsageGetGasTemperatureResponse,
    EnergyUsageGetTemperatureResponse,
    EnergyUsageGetWaterResponse,
    GasUsageItem,
    GetDomoticzJsonExport,
    GetDomoticzUsePerDayResponse,
    GetHaSensorHistoryResponse,
    GetHaStatesResponse,
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
import { fstatSync, openSync } from "fs";
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

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const MONTH = 1000 * 60 * 60 * 24 * 30;
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

const getStartOffsetFromRange = (
    range: EnergyUsageGetGasTemperatureQueryParams["range"]
) => {
    if (range === "day") {
        return DAY_IN_MS;
    }
    if (range === "week") {
        return DAY_IN_MS * 7;
    }
    if (range === "month") {
        // By default only 10 days are kept in the database. https://www.home-assistant.io/integrations/recorder/#purge_keep_days
        return DAY_IN_MS * 31;
    }
};

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
        const temperatureEntry =
            response.result?.find((r) => r.d === date) ?? undefined;
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
        temperatureResponses: GotTempResponse[],
        haTemperatureResponses: GetHaSensorHistoryResponse
    ) =>
    (date: string) => {
        const temperatureEntries = temperatureResponses.map(
            temperatureResponseToEntry(temperatureSensors, date)
        );
        const gasEntry = gasEntries?.find((r) => r.d === date) ?? undefined;

        // Patch inside temperature with firstHaTemperatureResponse
        const matchingHaEntry = haTemperatureResponses[0]?.find(
            (entry) => entry.last_changed?.slice(0, 10) === date
        );
        const temp = Object.fromEntries(temperatureEntries);
        if (temp["inside"].avg === "") {
            temp["inside"].avg = parseInt(matchingHaEntry?.state);
        }
        // End of patch

        const result: EnergyUsageGasItem = {
            day: date,
            counter: gasEntry?.c ?? "",
            used: gasEntry?.v ?? "",
            temp,
        };
        return result;
    };

const findUsePerDayTotalByDate = (
    total: GetDomoticzUsePerDayResponse["result"],
    date: string
) => {
    return total.find((e) => e.d === date);
};

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
    usePerDayTotals: GetDomoticzUsePerDayResponse["result"],
    logger: Logger
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
        logger.warn(`Can't get dayUsage for ${yearMonthDay}`);
        return undefined;
    }
};

const ELECTRIC_EXPORTS_ROOT_DIR = "./0_electric_exports";

const exportJsonToRow =
    (usePerDayTotals: GetDomoticzUsePerDayResponse["result"], logger: Logger) =>
    async (
        fileInDir: string
    ): Promise<EnergyUsageGetElectricExportsResponse[0] | undefined> => {
        const fileContents = await readFile(
            `${ELECTRIC_EXPORTS_ROOT_DIR}/${fileInDir}`,
            "utf-8"
        );
        try {
            const fileJson: GetDomoticzJsonExport = JSON.parse(fileContents);
            const firstItem = fileJson.result[0];
            const day = new Date(firstItem.d.slice(0, 10));

            // Align supplied entries to exact timepoints
            const normalizedEntries = TIMEPOINTS.map(
                getNormalizedEntries(fileJson)
            );

            const dayUsage = getDayUsage(day, usePerDayTotals, logger);

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
            logger.warn(`Can't process ${fileInDir}`);
            return undefined;
        }
    };

type SensorEntry = GetHaSensorHistoryResponse[0][0] & {
    states?: string[];
    cumulativeState?: string;
};

const getSlotFromEntry = (timeslot: number, entry: SensorEntry) => {
    const entryTimestampMs = new Date(entry.last_changed).getTime();

    const entrySlotNr = Math.floor(entryTimestampMs / timeslot);
    const start = entrySlotNr * timeslot;
    const end = start + timeslot;

    return { entryTimestampMs, start, end };
};

const entryToTimeslotStart = (timeslot: number, entry: SensorEntry) => {
    const slot = getSlotFromEntry(timeslot, entry);

    return {
        ...entry,
        last_changed: new Date(slot.start).toISOString(),
    };
};

const avgString = (list: string[]) => {
    const nrList = list.map((n) => parseFloat(n)).filter((n) => !isNaN(n));
    const sum: number = nrList.reduce((acc: number, next: number) => {
        return acc + next;
    }, 0);
    return sum / nrList.length;
};

// timeslot is ms, the first timeslot of each day starts at 00:00
const reduceSensorEntriesByTimeslot =
    (timeslot: number) =>
    (acc: SensorEntry[], next: SensorEntry): SensorEntry[] => {
        const last = acc.at(-1);
        const lastTimestampStr = last?.last_changed;

        if (!lastTimestampStr) {
            return [entryToTimeslotStart(timeslot, next)];
        }

        const lastSlot = getSlotFromEntry(timeslot, last);
        const nextSlot = getSlotFromEntry(timeslot, next);

        if (nextSlot.entryTimestampMs <= lastSlot.end) {
            const head = acc.slice(0, -1);
            const states = [...(last.states ?? [last.state]), next.state];
            return [
                ...head,
                {
                    ...last,
                    states,
                    state: avgString(states).toString(),
                },
            ];
        }

        return [...acc, entryToTimeslotStart(timeslot, next)];
    };

const reduceSensorEntriesToDeltas = (
    acc: SensorEntry[],
    next: SensorEntry
): SensorEntry[] => {
    const last = acc.at(-1);

    if (!last?.cumulativeState) {
        return [
            ...acc,
            {
                ...next,
                state: undefined,
                cumulativeState: next.state,
            },
        ];
    }
    return [
        ...acc,
        {
            ...next,
            cumulativeState: next.state,
            state: (
                parseFloat(next.state) - parseFloat(last.cumulativeState)
            ).toString(),
        },
    ];
};

@Controller("api/energyusage")
export class EnergyUsageController {
    private readonly logger: Logger;
    private readonly apiConfig: {
        baseUrl: string;
        sensors: SensorConfig[];
        electraSensorId: string;
    };
    private readonly haApiConfig: {
        baseUrl: string;
        token: string;
        temperatureSensorId: string;
        gasTemperatureSensorId: string;
        waterSensorId: string;
        electraSensorId: string;
    };

    constructor(private configService: ConfigService) {
        this.logger = new Logger(EnergyUsageController.name);
        const baseUrl = this.configService.get<string>("DOMOTICZ_URI") || "";
        const DOMOTICZ_SENSORS =
            this.configService.get<string>("DOMOTICZ_SENSORS") || "";
        this.apiConfig = {
            baseUrl,
            sensors: strToConfigs(DOMOTICZ_SENSORS),
            electraSensorId:
                this.configService.get<string>("DOMOTICZ_ELECTRA_SENSOR") || "",
        };
        this.haApiConfig = {
            baseUrl:
                this.configService.get<string>("HOMEASSISTANT_BASE_URL") || "",
            token: this.configService.get<string>("HOMEASSISTANT_TOKEN") || "",
            temperatureSensorId:
                this.configService.get<string>(
                    "HOMEASSISTANT_TEMPERATURE_SENSOR_ID"
                ) || "",
            gasTemperatureSensorId:
                this.configService.get<string>(
                    "HOMEASSISTANT_GASTEMPERATURE_SENSOR_ID"
                ) || "",
            waterSensorId:
                this.configService.get<string>(
                    "HOMEASSISTANT_WATER_SENSOR_ID"
                ) || "",
            electraSensorId:
                this.configService.get<string>(
                    "HOMEASSISTANT_ELECTRA_SENSOR_ID"
                ) || "",
        };
    }

    // @deprecated use fetchHa
    getAPI(sensorConfig: SensorConfig) {
        return `${this.apiConfig.baseUrl}/json.htm?type=graph&sensor=${sensorConfig.type}&idx=${sensorConfig.idx}&range=month`;
    }

    getFirstHaTemperatureResponse = async () => {
        const haTemperaturesIdsResponse = await fetch(
            `${this.haApiConfig.baseUrl}/api/states/sensor.temperatures`,
            {
                headers: {
                    Authorization: `Bearer ${this.haApiConfig.token}`,
                },
            }
        );
        const haTemperaturesIds =
            (await haTemperaturesIdsResponse.json()) as GetHaStatesResponse;

        // @ts-expect-error response can contain error message
        const firstHaTemperatureId = haTemperaturesIds.attributes.entity_id[0];
        const time = Date.now();
        const startOffset = MONTH;
        const startTime = new Date(time - startOffset).toISOString();
        const endTime = new Date(time).toISOString();
        const url = `${this.haApiConfig.baseUrl}/api/history/period/${startTime}?end_time=${endTime}&filter_entity_id=${firstHaTemperatureId}&minimal_response`;
        const firstHaTemperatureResponse = await got(url, {
            headers: {
                Authorization: `Bearer ${this.haApiConfig.token}`,
            },
        }).json<GetHaSensorHistoryResponse>();

        return firstHaTemperatureResponse;
    };

    async fetchHa<T>(path: string): Promise<T> {
        const response = await fetch(`${this.haApiConfig.baseUrl}${path}`, {
            headers: {
                Authorization: `Bearer ${this.haApiConfig.token}`,
            },
        });
        return response.json() as T;
    }

    /* Only uses Home Assistant API */
    @UseGuards(JwtAuthGuard)
    @Get("/gas-temperature")
    async getGasTemperature(
        @Request() req: AuthenticatedRequest,
        @Query("range") range: EnergyUsageGetGasTemperatureQueryParams["range"]
    ): Promise<EnergyUsageGetGasTemperatureResponse> {
        this.logger.verbose(
            `[${req.user.name}] GET to /api/energyusage/gas-temperature`
        );

        try {
            const time = Date.now();
            const startOffset = getStartOffsetFromRange(range);
            const startTime = new Date(time - startOffset).toISOString();
            const endTime = new Date(time).toISOString();

            const url = `/api/history/period/${startTime}?end_time=${endTime}&filter_entity_id=${this.haApiConfig.gasTemperatureSensorId}`;
            const result = await this.fetchHa<GetHaSensorHistoryResponse>(url);

            const reduced = result
                .map((sensorEntries) =>
                    // Reduce by timeslot, timeslot is RANGE, from 00:00
                    sensorEntries.reduce(
                        reduceSensorEntriesByTimeslot(
                            range === "day" ? DAY_IN_MS / 24 : DAY_IN_MS
                        ),
                        []
                    )
                )
                .map((sensorEntries) => {
                    if (
                        sensorEntries.length > 0 &&
                        sensorEntries[0].attributes.device_class === "gas"
                    ) {
                        return sensorEntries.reduce(
                            reduceSensorEntriesToDeltas,
                            []
                        );
                    }
                    return sensorEntries;
                });

            return reduced;
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
            const startOffset = range === "month" ? MONTH : DAY_IN_MS;
            const startTime = new Date(time - startOffset).toISOString();
            const endTime = new Date(time).toISOString();

            const url = `${this.haApiConfig.baseUrl}/api/history/period/${startTime}?end_time=${endTime}&filter_entity_id=${this.haApiConfig.temperatureSensorId}`;

            const result = await got(url, {
                headers: {
                    Authorization: `Bearer ${this.haApiConfig.token}`,
                },
            }).json<GetHaSensorHistoryResponse>();

            const reduced = result.map((sensorEntries) =>
                // Reduce by timeslot, timeslot is RANGE, from 00:00
                sensorEntries.reduce(
                    reduceSensorEntriesByTimeslot(
                        range === "day" ? DAY_IN_MS / 24 : DAY_IN_MS
                    ),
                    []
                )
            );

            return reduced;
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
            const startOffset = range === "month" ? MONTH : DAY_IN_MS;
            const startTime = new Date(time - startOffset).toISOString();
            const endTime = new Date(time).toISOString();

            const url = `${this.haApiConfig.baseUrl}/api/history/period/${startTime}?end_time=${endTime}&filter_entity_id=${this.haApiConfig.waterSensorId}`;

            const result = await got(url, {
                headers: {
                    Authorization: `Bearer ${this.haApiConfig.token}`,
                },
            }).json<GetHaSensorHistoryResponse>();

            const reduced = result
                .map((sensorEntries) =>
                    // Reduce by timeslot, timeslot is RANGE, from 00:00
                    sensorEntries.reduce(
                        reduceSensorEntriesByTimeslot(
                            range === "day" ? DAY_IN_MS / 24 : DAY_IN_MS
                        ),
                        []
                    )
                )
                .map((sensorEntries) => {
                    if (
                        sensorEntries.length > 0 &&
                        sensorEntries[0].attributes.device_class === "water"
                    ) {
                        return sensorEntries.reduce(
                            reduceSensorEntriesToDeltas,
                            []
                        );
                    }
                    return sensorEntries;
                });

            return reduced;
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
    ): Promise<EnergyUsageGetElectricExportsResponse> {
        this.logger.verbose(
            `[${req.user.name}] GET to /api/energyusage/electric/exports`
        );

        try {
            const filesInDir = await readdir(ELECTRIC_EXPORTS_ROOT_DIR);

            const filteredFilesInDir = filesInDir.filter((file) => {
                const fileRef = openSync(
                    `${ELECTRIC_EXPORTS_ROOT_DIR}/${file}`,
                    "r"
                );
                const stats = fstatSync(fileRef);
                return stats.isFile() && file.endsWith("_electra.json");
            });

            this.logger.verbose(`[${req.user.name}] start get counter`);

            const thisYear = new Date().getFullYear();
            const lastYear = thisYear - 1;

            const getUrl = (year: number) =>
                `${this.apiConfig.baseUrl}/json.htm?type=graph&sensor=counter&idx=${this.apiConfig.electraSensorId}&range=year&actyear=${year}`;

            const electricCounterResponseYear1: GetDomoticzUsePerDayResponse =
                await got(getUrl(lastYear)).json();
            const electricCounterResponseYear2: GetDomoticzUsePerDayResponse =
                await got(getUrl(thisYear)).json();

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
                    filteredFilesInDir.map<
                        Promise<EnergyUsageGetElectricExportsResponse[0]>
                    >(exportJsonToRow(usePerDayTotals, this.logger))
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

    @UseGuards(JwtAuthGuard)
    @Get("/electric")
    async getElectric(
        @Request() req: AuthenticatedRequest,
        @Query("range") range: "day" | "month"
    ): Promise<EnergyUsageGetElectricResponse> {
        this.logger.verbose(
            `[${req.user.name}] GET to /api/energyusage/electric`
        );

        try {
            const time = Date.now();
            const startOffset = range === "month" ? MONTH : DAY_IN_MS;
            const startTime = new Date(time - startOffset).toISOString();
            const endTime = new Date(time).toISOString();

            const url = `${this.haApiConfig.baseUrl}/api/history/period/${startTime}?end_time=${endTime}&filter_entity_id=${this.haApiConfig.electraSensorId}`;

            const result = await got(url, {
                headers: {
                    Authorization: `Bearer ${this.haApiConfig.token}`,
                },
            }).json<GetHaSensorHistoryResponse>();

            const reduced = result
                .map((sensorEntries) =>
                    // Reduce by timeslot, timeslot is RANGE, from 00:00
                    sensorEntries.reduce(
                        reduceSensorEntriesByTimeslot(
                            range === "day" ? DAY_IN_MS / 24 : DAY_IN_MS
                        ),
                        []
                    )
                )
                .map((sensorEntries) => {
                    if (
                        sensorEntries.length > 0 &&
                        sensorEntries[0].attributes.device_class === "energy"
                    ) {
                        return sensorEntries.reduce(
                            reduceSensorEntriesToDeltas,
                            []
                        );
                    }
                    return sensorEntries;
                });

            return reduced;
        } catch (err) {
            this.logger.error(`[${req.user.name}] ${err}`);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
