import { createSlice } from "@reduxjs/toolkit";

export enum Severity {
    INFO,
    ERROR,
}

export interface Logline {
    message: string;
    severity: Severity;
}

export interface LogState {
    lines: Logline[];
    urgentMessage: string | false;
}

export const initialState: LogState = {
    lines: [],
    urgentMessage: false,
};

const writeLog = (...messages: string[]): string => {
    const time = new Date();
    const timestamp = time.toTimeString().substring(0, 8);
    return `${timestamp} ${messages.join(" ")}`;
};

const logSlice = createSlice({
    name: "loglines",
    initialState,
    reducers: {
        logInfo: (draft, { payload }): void => {
            draft.lines.push({
                message: writeLog("INFO: ", payload),
                severity: Severity.INFO,
            });
        },
        logError: (draft, { payload }): void => {
            if (payload) {
                const message = writeLog("ERROR:", payload);
                draft.lines.push({ message, severity: Severity.ERROR });
                draft.urgentMessage = message;
            }
        },
        clearLog: (): LogState => {
            return initialState;
        },
    },
});

export const { logInfo, logError, clearLog } = logSlice.actions;

export default logSlice.reducer;
