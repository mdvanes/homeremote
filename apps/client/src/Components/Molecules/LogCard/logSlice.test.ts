import logSliceReducer, {
    Severity,
    clearLog,
    initialState,
    logError,
    logInfo,
    logUrgentInfo,
} from "./logSlice";

describe("logSlice", () => {
    it("adds an info line on logInfo", () => {
        const state = initialState;
        const result = logSliceReducer(state, {
            payload: "my info message",
            type: logInfo.type,
        });
        expect(result).toEqual({
            lines: [
                {
                    message: expect.stringContaining("my info message"),
                    severity: Severity.INFO,
                },
            ],
            urgentMessage: false,
        });
    });

    it("adds an info line on logInfoUrgent", () => {
        const state = initialState;
        const result = logSliceReducer(state, {
            payload: "my info message",
            type: logUrgentInfo.type,
        });
        expect(result).toEqual({
            lines: [
                {
                    message: expect.stringContaining("my info message"),
                    severity: Severity.INFO,
                },
            ],
            urgentMessage: {
                message: expect.stringContaining("my info message"),
                severity: Severity.INFO,
            },
        });
    });

    it("adds an error line on logError", () => {
        const state = initialState;
        const result = logSliceReducer(state, {
            payload: "my error message",
            type: logError.type,
        });
        expect(result).toEqual({
            lines: [
                {
                    message: expect.stringContaining("my error message"),
                    severity: Severity.ERROR,
                },
            ],
            urgentMessage: {
                message: expect.stringContaining("my error message"),
                severity: Severity.ERROR,
            },
        });
    });

    it("ignores errors without message", () => {
        const state = initialState;
        const result = logSliceReducer(state, {
            type: logError.type,
        });
        expect(result).toEqual({
            lines: [],
            urgentMessage: false,
        });
    });

    it("clears the log on clearLog", () => {
        const state = {
            ...initialState,
            lines: [
                { message: "test1", severity: Severity.INFO },
                { message: "test2", severity: Severity.ERROR },
            ],
        };
        const result = logSliceReducer(state, {
            type: clearLog.type,
        });
        expect(result).toEqual({
            lines: [],
            urgentMessage: false,
        });
    });
});
