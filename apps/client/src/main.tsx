import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App, { AppProps } from "./App";
import { isDemoMode, startDemo } from "./demo";
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

const registerServiceWorker = (): void => {
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
};

const bootstrap = async (): Promise<void> => {
    const demo = isDemoMode();

    // In demo mode the Mock Service Worker must be running before the app makes
    // any request. Skip the PWA service worker so it doesn't clash with the
    // demo worker over the same "/" scope.
    if (demo) {
        await startDemo();
    }

    root.render(
        <Provider store={store}>
            <App swCallbacks={swCallbacks} />
        </Provider>
    );

    if (!demo) {
        registerServiceWorker();
    }
};

void bootstrap();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
