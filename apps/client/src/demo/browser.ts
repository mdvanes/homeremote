import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// The browser-side Mock Service Worker that powers demo mode. It is only ever
// imported (dynamically) when isDemoMode() is true, so msw + the demo handlers
// stay out of the production bundle.
export const worker = setupWorker(...handlers);
