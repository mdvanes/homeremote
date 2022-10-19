import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

export const getErrorMessage = (
    error: FetchBaseQueryError | SerializedError
): string => {
    if ("status" in error) {
        const message = (error.data as { message?: string }).message ?? "";
        return `${error.status}: ${message}`;
    }
    if ("message" in error) {
        return `${error.name}: ${error.message}`;
    }
    return "Unexpected error";
};
