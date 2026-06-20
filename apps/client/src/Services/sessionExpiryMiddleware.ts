import {
    isRejectedWithValue,
    Middleware,
    ThunkDispatch,
    UnknownAction,
} from "@reduxjs/toolkit";
import {
    fetchAuth,
    FetchAuthType,
} from "../Components/Providers/Authentication/authenticationSlice";
import { RootState } from "../Reducers";

const UNAUTHORIZED = 401;

/**
 * Globally self-heal expired sessions.
 *
 * When any RTK Query request is rejected with a 401, the session has likely
 * timed out. Instead of every polled card showing its own error (and the user
 * having to reload the whole page), re-check the current profile once. If the
 * session really expired, `fetchAuth` rejects and `AuthenticationProvider`
 * shows the login screen; if it was a transient blip, the user stays signed in
 * and the cards keep polling.
 */
export const sessionExpiryMiddleware: Middleware =
    (api) => (next) => (action) => {
        if (isRejectedWithValue(action)) {
            const payload = action.payload as { status?: number | string };
            const isSignedIn = (api.getState() as RootState).authentication
                .isSignedIn;
            if (payload?.status === UNAUTHORIZED && isSignedIn) {
                const dispatch = api.dispatch as ThunkDispatch<
                    unknown,
                    unknown,
                    UnknownAction
                >;
                dispatch(fetchAuth({ type: FetchAuthType.Current }));
            }
        }
        return next(action);
    };
