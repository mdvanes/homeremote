/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/api/smart-entities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getSmartEntities"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/smart-entities/{entity_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["updateSmartEntity"];
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
        /** @description Get smart entities response */
        GetSmartEntitiesResponse: {
            entities?: components["schemas"]["State"][];
        };
        State: {
            /** @example light.favorites */
            entity_id?: string;
            /** @example off */
            state?: string;
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
            /**
             * Format: date-time
             * @example 2024-05-21T13:16:22.061360+00:00
             */
            last_changed?: string;
            /**
             * Format: date-time
             * @example 2024-05-21T13:16:22.071293+00:00
             */
            last_reported?: string;
            /**
             * Format: date-time
             * @example 2024-05-21T13:16:22.061360+00:00
             */
            last_updated?: string;
            context?: {
                /** @example 01HYDMQE5DJ7QP3F5ADKNKXFDQ */
                id?: string;
                /** Format: nullable */
                parent_id?: string;
                /** Format: nullable */
                user_id?: string;
            };
        };
        UpdateSmartEntityBody: {
            /**
             * @description Target state, on or off
             * @enum {string}
             */
            state?: "on" | "off";
        };
        UpdateSmartEntityResponse: Record<string, never>;
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    getSmartEntities: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description getSmartEntities */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GetSmartEntitiesResponse"];
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
    updateSmartEntity: {
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
                "application/json": components["schemas"]["UpdateSmartEntityBody"];
            };
        };
        responses: {
            /** @description updateSmartEntity */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UpdateSmartEntityResponse"];
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
