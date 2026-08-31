import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App, { AppProps } from "./App";
import { isDemoMode, startDemo } from "./demo";
import { register, unregister } from "./serviceWorkerRegistration";
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
    register({
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
    // any request, and it needs the same "/" scope as the PWA service worker.
    // Only one worker can control a page, so the PWA one has to go first. That
    // includes the case where demo mode is switched on at runtime with ?demo on
    // a production build that is already being controlled - hence the reload.
    if (demo) {
        const wasControlling = await unregister();
        if (wasControlling) {
            window.location.reload();
            return;
        }
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
