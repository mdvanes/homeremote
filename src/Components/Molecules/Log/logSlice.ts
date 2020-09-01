import { createSlice } from "@reduxjs/toolkit";

export interface Logline {
    message: string;
}

export interface LogState {
    lines: Logline[];
    urgentMessage: string | false;
}

const initialState: LogState = {
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
            state.lines.push({ message: writeLog("INFO: ", payload) });
        },
        logError: (state, { payload }): void => {
            const message = writeLog("ERROR:", payload);
            state.lines.push({ message });
            state.urgentMessage = message;
        },
        clearLog: (state): void => {
            state = initialState;
        },
    },
});

export const { logInfo, logError, clearLog } = logSlice.actions;

export default logSlice.reducer;
