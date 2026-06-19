import {
    Middleware,
    Reducer,
    Store,
    combineReducers,
    configureStore,
} from "@reduxjs/toolkit";
import { RenderOptions, RenderResult, render } from "@testing-library/react";
import { FC, ReactElement, ReactNode } from "react";
import { Provider } from "react-redux";
import { RootState } from "./Reducers";
import { FetchMock } from "./test/mswFetchMock";

interface RenderWithProvidersOptions extends RenderOptions {
    initialState: Partial<RootState>;
    reducers: Record<string, Reducer>;
    store?: Store;
}

type RenderWithProviders = (
    ui: ReactElement,
    options: RenderWithProvidersOptions
) => RenderResult;

export const renderWithProviders: RenderWithProviders = (
    ui,
    {
        initialState,
        reducers,
        store = configureStore({
            reducer: combineReducers(reducers),
            preloadedState: initialState,
        }),
        ...renderOptions
    }
) => {
    const Wrapper: FC<{ children: ReactNode }> = ({ children }) => {
        return <Provider store={store}>{children}</Provider>;
    };
    return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// For the MSW-backed fetch mock: the recorded first fetch argument is the
// Request (or URL string) passed to `fetch`. RTK Query builds it from a
// relative `baseUrl`, so prefer the original URL captured on `__rawUrl` (set by
// the Request polyfill in setupTests) to reproduce the exact requested URL.
const rawUrlOf = (call: unknown[]): string => {
    const input = call[0];
    if (typeof input === "string") {
        return input;
    }
    const request = input as Request & { __rawUrl?: string };
    return request.__rawUrl ?? request.url;
};

export const createGetCalledUrl = (fetchMock: FetchMock) => (callNr: number) =>
    rawUrlOf(fetchMock.mock.calls[callNr]);
export const createGetCalledMethod =
    (fetchMock: FetchMock) => (callNr: number) =>
        (fetchMock.mock.calls[callNr][0] as Request).method;
export const createGetCalledBody =
    (fetchMock: FetchMock) => (callNr: number) => {
        const request = fetchMock.mock.calls[callNr][0] as Request;
        return request.json();
    };

// For RTK Query
export interface MockStoreProviderApi {
    reducerPath: string;
    reducer: Reducer;
    middleware?: Middleware;
}

interface MockStoreProviderApiWithMiddleware {
    reducerPath: string;
    reducer: Reducer;
    middleware: Middleware;
}

interface MockStoreProviderProps {
    apis: MockStoreProviderApi[];
    children: ReactNode;
}

const hasMiddleWare = (
    api: MockStoreProviderApi | MockStoreProviderApiWithMiddleware
): api is MockStoreProviderApiWithMiddleware => {
    return typeof api.middleware !== "undefined";
};

export const MockStoreProvider: FC<MockStoreProviderProps> = ({
    apis,
    children,
}) => {
    const reducerEntries = Object.fromEntries(
        apis.map((api) => [[api.reducerPath], api.reducer])
    );
    const middlewares = apis.filter(hasMiddleWare).map((api) => api.middleware);

    const rootReducer = combineReducers({
        ...reducerEntries,
    });

    const store = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(...middlewares),
    });

    return <Provider store={store}>{children}</Provider>;
};
