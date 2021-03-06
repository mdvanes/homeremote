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
