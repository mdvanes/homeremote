import React, { FC, ReactElement } from "react";
import { render, RenderResult, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import {
    combineReducers,
    configureStore,
    Reducer,
    Store,
} from "@reduxjs/toolkit";
import { RootState } from "./Reducers";

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

// For RTK Query
type MockStoreProviderProps = {
    api: any;
};

export const MockStoreProvider: FC<MockStoreProviderProps> = ({
    api,
    children,
}) => {
    const rootReducer = combineReducers({
        [api.reducerPath]: api.reducer,
    });

    const store = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(api.middleware),
    });

    return <Provider store={store}>{children}</Provider>;
};
