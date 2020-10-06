import React, { FC, ReactElement } from "react";
import * as ReactRedux from "react-redux";
import {
    render,
    fireEvent,
    RenderResult,
    RenderOptions,
} from "@testing-library/react";
// import SwitchBarList from "./SwitchBarList";
// import { RootState } from "../../../Reducers";
// import * as Slice from "./switchBarListSlice";
// import SwitchBar from "./SwitchBar";
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
    reducers: Record<string, Reducer>; // Reducer<CombinedState<>, AnyAction>;
    store?: Store;
}

type RenderWithProviders = (
    ui: ReactElement,
    options: RenderWithProvidersOptions
) => RenderResult;

// TODO extract to helper
export const renderWithProviders: RenderWithProviders = (
    ui,
    {
        initialState,
        reducers,
        store = configureStore({
            // reducer: combineReducers({ switchesList: Slice.default }),
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
