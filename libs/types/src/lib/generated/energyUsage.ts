/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/api/energyusage/electric/exports": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getElectricExports"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/energyusage/temperature": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get temperatures
         * @description Get temperatures
         */
        get: operations["getTemperatures"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/energyusage/gas-temperature": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get gas and temperatures
         * @description Get gas and temperatures
         */
        get: operations["getGasTemperatures"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/energyusage/water": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get water
         * @description Get water
         */
        get: operations["getWater"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** @enum {string} */
        Range: "day" | "week" | "month";
        /** @description Error information details */
        ErrorResponse: {
            /** @description Time when error happened */
            timestamp?: string;
            /**
             * Format: int32
             * @description Code describing the error
             */
            status?: number;
            /** @description Short error name */
            error?: string;
            /** @description Message explaining the error */
            message?: string;
            /**
             * Format: int32
             * @description Code of the error
             */
            code?: number;
        };
        GetElectricExportsResponse: {
            /** @example 2023071705:25:01_electra.json */
            exportName?: string;
            /** @description for sorting */
            dateMillis?: number;
            /** @example 2024-05-08T12:59:26.161Z */
            date?: string;
            /**
             * @description store dayOfWeek separately. When this is stored in a datebase it can be queried quickly
             * @example Monday
             */
            dayOfWeek?: string;
            /** @description day usage */
            dayUsage?: number;
            entries?: {
                /** @description usage low */
                v1?: number;
                /** @description usage high */
                v2?: number;
                /** @description usage total */
                v?: number;
                /** @example 13:37 */
                time?: string;
            }[];
        }[];
        GetTemperaturesResponse: {
            /** @example sensor.tz3000_amqudjr0_ts0201_temperature */
            entity_id?: string;
            /** @example 17.7 */
            state?: string;
            attributes?: {
                /** @example measurement */
                state_class?: string;
                /** @example °C */
                unit_of_measurement?: string;
                /** @example temperature */
                device_class?: string;
                /** @example Woox TempHumid 1 Temperature */
                friendly_name?: string;
            };
            /**
             * Format: date-time
             * @example 2024-05-05T00:00:00+00:00
             */
            last_changed?: string;
            /**
             * Format: date-time
             * @example 2024-05-05T00:00:00+00:00
             */
            last_reported?: string;
            /**
             * Format: date-time
             * @example 2024-05-05T00:00:00+00:00
             */
            last_updated?: string;
            context?: {
                /** @example 01HWQC2MBD01BVZJP660G9JKXA */
                id?: string;
                /** Format: nullable */
                parent_id?: string;
                /** Format: nullable */
                user_id?: string;
            };
        }[][];
        GetGasTemperaturesResponse: {
            /** @example sensor.tz3000_amqudjr0_ts0201_temperature */
            entity_id?: string;
            /** @example 17.7 */
            state?: string;
            attributes?: {
                /** @example measurement */
                state_class?: string;
                /** @example °C */
                unit_of_measurement?: string;
                /** @example temperature */
                device_class?: string;
                /** @example Woox TempHumid 1 Temperature */
                friendly_name?: string;
            };
            /**
             * Format: date-time
             * @example 2024-05-05T00:00:00+00:00
             */
            last_changed?: string;
            /**
             * Format: date-time
             * @example 2024-05-05T00:00:00+00:00
             */
            last_reported?: string;
            /**
             * Format: date-time
             * @example 2024-05-05T00:00:00+00:00
             */
            last_updated?: string;
            context?: {
                /** @example 01HWQC2MBD01BVZJP660G9JKXA */
                id?: string;
                /** Format: nullable */
                parent_id?: string;
                /** Format: nullable */
                user_id?: string;
            };
        }[][];
        GetWaterResponse: {
            /** @example sensor.liters */
            entity_id?: string;
            /**
             * Format: date
             * @example 3201
             */
            state?: string;
            attributes?: {
                /** @example total */
                state_class?: string;
                /** @example L */
                unit_of_measurement?: string;
                /** @example water */
                device_class?: string;
                /** @example liters */
                friendly_name?: string;
            };
            /**
             * Format: date-time
             * @example 2024-05-06T00:00:00+00:00
             */
            last_changed?: string;
            /**
             * Format: date-time
             * @example 2024-05-06T00:00:00+00:00
             */
            last_reported?: string;
            /**
             * Format: date-time
             * @example 2024-05-06T00:00:00+00:00
             */
            last_updated?: string;
            context?: {
                /** @example 01HWQC2MBD01BVZJP660G9JKXA */
                id?: string;
                /** Format: nullable */
                parent_id?: string;
                /** Format: nullable */
                user_id?: string;
            };
        }[][];
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    getElectricExports: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description ElectricExports */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GetElectricExportsResponse"];
                };
            };
            /** @description Bad request. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Unauthorized. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getTemperatures: {
        parameters: {
            query?: {
                range?: "day" | "month";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Temperatures */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GetTemperaturesResponse"];
                };
            };
            /** @description Bad request. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Unauthorized. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getGasTemperatures: {
        parameters: {
            query?: {
                range?: components["schemas"]["Range"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description GasTemperatures */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GetGasTemperaturesResponse"];
                };
            };
            /** @description Bad request. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Unauthorized. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getWater: {
        parameters: {
            query?: {
                range?: components["schemas"]["Range"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Water */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GetWaterResponse"];
                };
            };
            /** @description Bad request. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Unauthorized. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
}
