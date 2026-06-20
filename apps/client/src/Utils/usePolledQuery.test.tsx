import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { FC, ReactNode } from "react";
import { Provider } from "react-redux";
import loglinesReducer, {
    LogState,
    Severity,
} from "../Components/Molecules/LogCard/logSlice";
import fetchMock, { enableFetchMocks } from "../test/mswFetchMock";
import { usePolledQuery } from "./usePolledQuery";

interface Thing {
    value: string;
}

const testApi = createApi({
    reducerPath: "testApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/" }),
    endpoints: (build) => ({
        getThing: build.query<Thing, void>({
            query: () => "/api/thing",
        }),
    }),
});

const makeWrapper = () => {
    const store = configureStore({
        reducer: combineReducers({
            loglines: loglinesReducer,
            [testApi.reducerPath]: testApi.reducer,
        }),
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(testApi.middleware),
    });
    const wrapper: FC<{ children: ReactNode }> = ({ children }) => (
        <Provider store={store}>{children}</Provider>
    );
    return { store, wrapper };
};

type TestStore = ReturnType<typeof makeWrapper>["store"];

const linesOf = (store: TestStore, severity: Severity) =>
    (store.getState().loglines as LogState).lines.filter(
        (line) => line.severity === severity
    );

const serverError = { body: JSON.stringify({ message: "down" }), status: 500 };

enableFetchMocks();

describe("usePolledQuery", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    it("returns data and is not stale while healthy", async () => {
        fetchMock.mockResponse(JSON.stringify({ value: "ok" }));
        const { store, wrapper } = makeWrapper();

        const { result } = renderHook(
            () =>
                usePolledQuery(testApi.useGetThingQuery, undefined, {
                    name: "Test",
                    pollingInterval: 10_000,
                }),
            { wrapper }
        );

        await waitFor(() =>
            expect(result.current.data).toEqual({ value: "ok" })
        );
        expect(result.current.isError).toBe(false);
        expect(result.current.isStale).toBe(false);
        expect(result.current.lastUpdated).toEqual(expect.any(Number));
        expect(linesOf(store, Severity.ERROR)).toHaveLength(0);
    });

    it("keeps polling after an error but only logs it once per streak", async () => {
        fetchMock.mockResponse(serverError);
        const { store, wrapper } = makeWrapper();

        renderHook(
            () =>
                usePolledQuery(testApi.useGetThingQuery, undefined, {
                    name: "Test",
                    pollingInterval: 30,
                }),
            { wrapper }
        );

        await waitFor(() =>
            expect(
                linesOf(store, Severity.ERROR).length
            ).toBeGreaterThanOrEqual(1)
        );
        // Let several poll cycles run.
        await new Promise((resolve) => setTimeout(resolve, 250));

        // Self-healing: it keeps retrying instead of stopping after one error.
        expect(fetchMock.mock.calls.length).toBeGreaterThan(1);
        // Throttled: the log is not flooded while the service stays down.
        expect(linesOf(store, Severity.ERROR)).toHaveLength(1);
    });

    it("self-heals and logs recovery after a transient failure", async () => {
        let attempts = 0;
        fetchMock.mockResponse(() => {
            attempts += 1;
            return attempts === 1
                ? serverError
                : JSON.stringify({ value: "back" });
        });
        const { store, wrapper } = makeWrapper();

        const { result } = renderHook(
            () =>
                usePolledQuery(testApi.useGetThingQuery, undefined, {
                    name: "Test",
                    pollingInterval: 30,
                }),
            { wrapper }
        );

        await waitFor(
            () => expect(result.current.data).toEqual({ value: "back" }),
            { timeout: 3000 }
        );

        expect(result.current.isError).toBe(false);
        // It did fail once (logged), then recovered (logged), proving it kept
        // polling and healed itself rather than stopping on the first error.
        expect(linesOf(store, Severity.ERROR)).toHaveLength(1);
        expect(
            linesOf(store, Severity.INFO).some((line) =>
                line.message.includes("Test recovered")
            )
        ).toBe(true);
    });

    it("keeps showing the last value marked as stale after an error", async () => {
        let shouldFail = false;
        fetchMock.mockResponse(() =>
            shouldFail ? serverError : JSON.stringify({ value: "first" })
        );
        const { wrapper } = makeWrapper();

        const { result } = renderHook(
            () =>
                usePolledQuery(testApi.useGetThingQuery, undefined, {
                    name: "Test",
                    pollingInterval: 30,
                }),
            { wrapper }
        );

        await waitFor(() =>
            expect(result.current.data).toEqual({ value: "first" })
        );

        shouldFail = true;
        await waitFor(() => expect(result.current.isError).toBe(true), {
            timeout: 3000,
        });

        expect(result.current.isStale).toBe(true);
        // The last known value is retained instead of being hidden.
        expect(result.current.data).toEqual({ value: "first" });
        // lastUpdated still points at the successful load so the UI can show
        // how old the visible data is.
        expect(result.current.lastUpdated).toEqual(expect.any(Number));
    });

    it("retry() refetches immediately", async () => {
        fetchMock.mockResponse(serverError);
        const { wrapper } = makeWrapper();

        const { result } = renderHook(
            () =>
                usePolledQuery(testApi.useGetThingQuery, undefined, {
                    name: "Test",
                    pollingInterval: 10_000,
                }),
            { wrapper }
        );

        await waitFor(() => expect(result.current.isError).toBe(true));
        const callsBeforeRetry = fetchMock.mock.calls.length;

        fetchMock.mockResponse(JSON.stringify({ value: "ok" }));
        act(() => {
            result.current.retry();
        });

        await waitFor(() =>
            expect(result.current.data).toEqual({ value: "ok" })
        );
        expect(fetchMock.mock.calls.length).toBeGreaterThan(callsBeforeRetry);
    });
});
