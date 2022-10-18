import React, { FC, ReactElement } from "react";
import { render, RenderResult, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import {
    combineReducers,
    configureStore,
    Middleware,
    Reducer,
    Store,
} from "@reduxjs/toolkit";
import { RootState } from "./Reducers";
import { FetchMock } from "jest-fetch-mock";

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
    const Wrapper: FC = ({ children }) => {
        return <Provider store={store}>{children}</Provider>;
    };
    return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// For jest-fetch-mock
export const createGetCalledUrl = (fetchMock: FetchMock) => (callNr: number) =>
    (fetchMock.mock.calls[callNr][0] as Request).url;
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
