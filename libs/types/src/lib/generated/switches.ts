/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
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
