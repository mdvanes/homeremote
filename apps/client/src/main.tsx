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

const root = ReactDOM.createRoot(
document.getElementById("root") as HTMLElement
);
root.render(
<Provider store={store}>
<App swCallbacks={swCallbacks} />
</Provider>
);   onUpdate: (message) => {
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
