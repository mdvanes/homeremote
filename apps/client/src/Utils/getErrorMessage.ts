import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

export const getErrorMessage = (
    error: FetchBaseQueryError | SerializedError
): string => {
    if ("status" in error) {
        let message = "";
        if ("data" in error) {
            const data = error.data as { message?: string };
            if (data.message) {
                message += data.message;
            }
        }
        if ("error" in error && typeof error.error === "string") {
            message += error.error;
        }
        if (message) {
            return `[${error.status}] ${message}`;
        }
        return `${error.status}: unspecified error`;
    }
    if ("message" in error) {
        return `[${error.name}] ${error.message}`;
    }
    return "Unexpected error";
};
