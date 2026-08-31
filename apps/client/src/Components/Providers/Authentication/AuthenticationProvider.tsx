import { Alert } from "@mui/material";
import { FC, ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../Reducers";
import { requestPersistentStorage } from "../../../Utils/requestPersistentStorage";
import { useAppDispatch } from "../../../store";
import AppSkeleton from "../../Molecules/AppSkeleton/AppSkeleton";
import LoginPage from "./LoginPage";
import {
    AuthenticationState,
    FetchAuthType,
    fetchAuth,
} from "./authenticationSlice";

const LOGIN_ENDPOINT = "/auth/login";
const UNAUTHORIZED_MESSAGE = `${LOGIN_ENDPOINT} Unauthorized`;

const AuthenticationProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();

    const {
        error: authenticationError,
        isLoading,
        isSignedIn,
    } = useSelector<RootState, AuthenticationState>(
        (state: RootState) => state.authentication
    );

    useEffect(() => {
        dispatch(fetchAuth({ type: FetchAuthType.Current }));
    }, [dispatch]);

    // While offline the profile request is answered by the service worker's
    // OFFLINE fallback. Re-ask the moment the network is back so the banner
    // clears without needing a reload.
    useEffect(() => {
        const onOnline = (): void => {
            dispatch(fetchAuth({ type: FetchAuthType.Current }));
        };

        window.addEventListener("online", onOnline);
        return () => window.removeEventListener("online", onOnline);
    }, [dispatch]);

    useEffect(() => {
        if (isSignedIn) {
            requestPersistentStorage();
        }
    }, [isSignedIn]);

    const errorMessageAlert = authenticationError &&
        authenticationError.indexOf(LOGIN_ENDPOINT) > -1 && (
            <Alert severity="error">
                {authenticationError.indexOf(UNAUTHORIZED_MESSAGE) > -1
                    ? "Invalid username/password"
                    : authenticationError}
            </Alert>
        );

    if (!isSignedIn && isLoading) {
        return <AppSkeleton />;
    } else if (!isSignedIn) {
        return <LoginPage errorMessage={errorMessageAlert} />;
    }

    // Being offline is no longer a blocker: the service worker serves the app
    // shell and previously cached artwork, and OfflineBanner explains the
    // state. See useIsOffline.
    return <>{children}</>;
};

export default AuthenticationProvider;
