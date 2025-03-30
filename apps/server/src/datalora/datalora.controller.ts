import {
    GetHaSensorHistoryResponse,
    TrackerItem,
    TrackerQueryType,
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
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AuthenticatedRequest } from "../login/LoginRequest.types";

// const createFluxQuery = (queryType: TrackerQueryType): string =>
//     `from(bucket:"iot")
//   |> range(start: ${queryType === "24h" ? "-24h" : "0"})
//   |> filter(fn: (r) => r._measurement == "location")`;

// const rowMapper = (
//     row: string[],
//     tableMeta: FluxTableMetaData
// ): TrackerItem | null => {
//     const o = tableMeta.toObject(row);
//     // console.log(row);
//     // console.log(
//     //   `${o._time} ${o._measurement} in ${o.region} (${o.sensor_id}): ${o._field}=${o._value}`
//     // );
//     if (typeof o._value === "string") {
//         // console.log(o._value);
//         const [latStr, lonStr] = o._value
//             .slice(1, o._value.length - 1)
//             .split(",");
//         const lat = parseFloat(latStr);
//         const lon = parseFloat(lonStr);
//         if (!isNaN(lat) && !isNaN(lon)) {
//             const loc: [number, number] = [lat, lon];
//             return { loc, time: o._time };
//         }
//     }
//     return null;
// };

// const isNotNull = <T>(item: T | null): item is T => {
//     return item !== null;
// };

// const getQueryType = (query: { type: TrackerQueryType }): TrackerQueryType => {
//     const t: TrackerQueryType = query?.type ?? "24h";
//     const isValid = t === "all" || t === "24h";
//     return isValid ? t : "24h";
// };

// const getLast = <T>(rows: T[]): T[] =>
//     rows.length > 0 ? rows.slice(rows.length - 1) : [];

@Controller("api/datalora")
export class DataloraController {
    private readonly logger: Logger;
    private readonly haApiConfig: {
        baseUrl: string;
        token: string;
        trackerIds: string;
    };

    constructor(private configService: ConfigService) {
        this.logger = new Logger(DataloraController.name);

        this.haApiConfig = {
            baseUrl:
                this.configService.get<string>("HOMEASSISTANT_BASE_URL") || "",
            token: this.configService.get<string>("HOMEASSISTANT_TOKEN") || "",
            trackerIds:
                this.configService.get<string>("HOMEASSISTANT_TRACKER_IDS") ||
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

    @UseGuards(JwtAuthGuard)
    @Get()
    async getCoords(
        @Request() req: AuthenticatedRequest,
        @Query() query: { type: TrackerQueryType }
    ): Promise<{ data: TrackerItem[][] }> {
        this.logger.verbose(`GET to /api/datalora`);

        // TODO set type=24H as default or handle type=ALL

        try {
            const time = Date.now();
            // See energyusage.controller.ts /gas-temperature
            const DAY_IN_MS = 1000 * 60 * 60 * 24;
            const startOffset = DAY_IN_MS;
            const startTime = new Date(time - startOffset).toISOString();
            const endTime = new Date(time).toISOString();

            const url = `/api/history/period/${startTime}?end_time=${endTime}&filter_entity_id=${this.haApiConfig.trackerIds}`;
            const result = await this.fetchHa<GetHaSensorHistoryResponse>(url);

            const data = result.map((device) =>
                device.map<TrackerItem>((entry) => {
                    console.log(entry.attributes);
                    // TODO return attributes
                    const {
                        charge,
                        // speed,
                        // odometer,
                        // altitude,
                        // icon,
                        friendly_name,
                        latitude,
                        longitude,
                    } = entry.attributes as {
                        charge: string;
                        // speed: string;
                        // odometer: string;
                        // altitude: string;
                        // icon: string;
                        friendly_name: string;
                        latitude: number;
                        longitude: number;
                    };
                    return {
                        loc: [latitude, longitude],
                        time: entry.last_changed,
                        name: friendly_name,
                        batteryLevel: charge ? parseFloat(charge) : undefined,
                    };
                })
            );

            return {
                data,
            };
        } catch (err) {
            this.logger.error(`[${req.user.name}] ${err}`);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // @UseGuards(JwtAuthGuard)
    // @Get()
    // async getCoords(
    //     @Query() query: { type: TrackerQueryType }
    // ): Promise<{ data: TrackerItem[] }> {
    //     this.logger.verbose(`GET to /api/datalora`);

    //     const url = this.configService.get<string>("INFLUX_URL") || "";
    //     const token = this.configService.get<string>("INFLUX_TOKEN") || "";
    //     const org = this.configService.get<string>("INFLUX_ORG") || "";

    //     const queryApi = new InfluxDB({ url, token }).getQueryApi(org);

    //     try {
    //         const queryType: TrackerQueryType = getQueryType(query);
    //         // TODO use subscription and web socket instead of collectRows___
    //         const rows = await queryApi.collectRows(
    //             createFluxQuery(queryType),
    //             rowMapper
    //         );
    //         const cleanRows = rows.filter(isNotNull);
    //         const backupRow =
    //             cleanRows.length === 0
    //                 ? getLast(
    //                       (
    //                           await queryApi.collectRows(
    //                               createFluxQuery("all"),
    //                               rowMapper
    //                           )
    //                       ).filter(isNotNull)
    //                   )
    //                 : null;
    //         const coords = backupRow || cleanRows;

    //         return {
    //             data: coords,
    //         };
    //     } catch (err) {
    //         this.logger.error(err);
    //         throw new HttpException(
    //             "failed to receive downstream data",
    //             HttpStatus.INTERNAL_SERVER_ERROR
    //         );
    //     }
    // }
}
