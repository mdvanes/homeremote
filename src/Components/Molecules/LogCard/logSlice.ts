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
        logInfo: (state, { payload }): void => {
            state.lines.push({
                message: writeLog("INFO: ", payload),
                severity: Severity.INFO,
            });
        },
        logError: (state, { payload }): void => {
            if (payload) {
                const message = writeLog("ERROR:", payload);
                state.lines.push({ message, severity: Severity.ERROR });
                state.urgentMessage = message;
            }
        },
        clearLog: (): LogState => {
            return initialState;
        },
    },
});

export const { logInfo, logError, clearLog } = logSlice.actions;

export default logSlice.reducer;
