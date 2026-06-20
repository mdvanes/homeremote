import {
    combineReducers,
    configureStore,
    createAsyncThunk,
} from "@reduxjs/toolkit";
import { waitFor } from "@testing-library/react";
import authenticationReducer, {
    initialState,
} from "../Components/Providers/Authentication/authenticationSlice";
import fetchMock, { enableFetchMocks } from "../test/mswFetchMock";
import { sessionExpiryMiddleware } from "./sessionExpiryMiddleware";

const dummyThunk = createAsyncThunk<unknown, void>(
    "dummy",
    async () => undefined
);

const rejectedWithStatus = (status: number) =>
    dummyThunk.rejected(null, "req-id", undefined, { status });

const makeStore = (isSignedIn: boolean) =>
    configureStore({
        reducer: combineReducers({ authentication: authenticationReducer }),
        preloadedState: {
            authentication: { ...initialState, isSignedIn },
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(sessionExpiryMiddleware),
    });

const profileWasFetched = () =>
    fetchMock.mock.calls.some((call) =>
        String(call[0]).includes("/api/profile/current")
    );

enableFetchMocks();

describe("sessionExpiryMiddleware", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        fetchMock.mockResponse(
            JSON.stringify({ id: 1, displayName: "Tester" })
        );
    });

    it("re-checks the session on a 401 while signed in", async () => {
        const store = makeStore(true);

        store.dispatch(rejectedWithStatus(401));

        await waitFor(() => expect(profileWasFetched()).toBe(true));
    });

    it("does nothing on a 401 when not signed in", async () => {
        const store = makeStore(false);

        store.dispatch(rejectedWithStatus(401));

        await new Promise((resolve) => setTimeout(resolve, 50));
        expect(profileWasFetched()).toBe(false);
    });

    it("ignores non-401 errors", async () => {
        const store = makeStore(true);

        store.dispatch(rejectedWithStatus(500));

        await new Promise((resolve) => setTimeout(resolve, 50));
        expect(profileWasFetched()).toBe(false);
    });
});
