/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/api/switches/ha": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getSwitches"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/switches/ha/{entity_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["updateHaSwitch"];
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
        /** @description Get switches response */
        GetSwitchesResponse: {
            switches?: components["schemas"]["Switch"][];
        };
        Switch: {
            /** @description Entity ID */
            entity_id?: string;
            /**
             * @description Current state, On or Off
             * @enum {string}
             */
            state?: "on" | "off";
            attributes?: {
                supported_color_modes?: string[];
                /** Format: nullable */
                color_mode?: string;
                /** Format: nullable */
                brightness?: string;
                entity_id?: string[];
                /** @example mdi:lightbulb-group */
                icon?: string;
                /** @example Favorites */
                friendly_name?: string;
                /**
                 * Format: int32
                 * @example 0
                 */
                supported_features?: number;
                /**
                 * Format: nullable
                 * @description Undefined for switches. Can also be e.g. `temperature`.
                 */
                device_class?: string;
                /** @example measurement */
                state_class?: string;
                /**
                 * Format: nullable
                 * @example °C
                 */
                unit_of_measurement?: string;
            };
        };
        UpdateHaSwitchResponse: string;
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    getSwitches: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description getSwitches */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GetSwitchesResponse"];
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
    updateHaSwitch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Entity ID */
                entity_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description Target state, On or Off
                     * @enum {string}
                     */
                    state?: "On" | "Off";
                };
            };
        };
        responses: {
            /** @description updateHaSwitch */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UpdateHaSwitchResponse"];
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
