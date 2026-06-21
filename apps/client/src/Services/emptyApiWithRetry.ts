import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";

// NOTE: retries are disabled (maxRetries: 0). Every consumer of this base API
// is polled through usePolledQuery, which already provides its own self-healing
// backoff. Per-request RTK retries on top of that just keep the loading bar
// spinning for several seconds on each failure, so they are turned off here to
// keep the loading indicator a quick blip like the non-retry cards.
export const emptyApiWithRetry = createApi({
    reducerPath: "homeremoteGeneratedApiWithRetry",
    baseQuery: retry(fetchBaseQuery({ baseUrl: "/" }), { maxRetries: 0 }),
    endpoints: () => ({}),
});
