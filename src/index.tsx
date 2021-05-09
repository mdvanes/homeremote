import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App, { AppProps } from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
// import reportWebVitals from './reportWebVitals';
import { store } from "./store";

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
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
