import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { urlToMusicApi } from "../../../Services/urlToMusicApi";

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
    urgentMessage: Logline | false;
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
        logInfo: (draft, { payload }: PayloadAction<string>): void => {
            draft.lines.push({
                message: writeLog("INFO: ", payload),
                severity: Severity.INFO,
            });
        },
        logUrgentInfo: (draft, { payload }: PayloadAction<string>): void => {
            if (payload) {
                const message = writeLog("INFO:", payload);
                const logline = { message, severity: Severity.INFO };
                draft.lines.push(logline);
                draft.urgentMessage = logline;
            }
        },
        logError: (draft, { payload }): void => {
            if (payload) {
                const message = writeLog("ERROR:", payload);
                const logline = { message, severity: Severity.ERROR };
                draft.lines.push(logline);
                draft.urgentMessage = logline;
            }
        },
        clearLog: (): LogState => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            urlToMusicApi.endpoints.getInfo.matchFulfilled,
            (draft, { payload }): void => {
                draft.lines.push({
                    message: writeLog(
                        `INFO: music bin v${payload.versionInfo}`
                    ),
                    severity: Severity.INFO,
                });
            }
        );
        builder.addMatcher(
            urlToMusicApi.endpoints.getMusicProgress.matchFulfilled,
            (draft, { payload }): void => {
                if (payload.state === "finished") {
                    draft.lines.push({
                        message: writeLog(`INFO: Music in v${payload.path}`),
                        severity: Severity.INFO,
                    });
                }
            }
        );
    },
});

export const { logInfo, logUrgentInfo, logError, clearLog } = logSlice.actions;

export default logSlice.reducer;
