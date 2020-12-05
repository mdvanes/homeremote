import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import App, { AppProps } from "./App";
import * as serviceWorker from "./serviceWorker";
import rootReducer from "./Reducers";

const store = configureStore({
    reducer: rootReducer,
});

const swCallbacks: AppProps["swCallbacks"] = {
    logSuccess: null,
    logUpdate: null,
};

ReactDOM.render(
    <Provider store={store}>
        <App swCallbacks={swCallbacks} />
    </Provider>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register({
    onSuccess: (message) => {
        const { logSuccess } = swCallbacks;
        if (logSuccess) {
            logSuccess(message);
        }
    },
    onUpdate: (message) => {
        const { logUpdate } = swCallbacks;
        if (logUpdate) {
            logUpdate(message);
        }
    },
});
