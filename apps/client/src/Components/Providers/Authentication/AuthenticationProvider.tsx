import {
    Alert,
    AlertTitle,
    Container,
    CssBaseline,
    ThemeProvider as MuiThemeProvider,
    StyledEngineProvider,
    useMediaQuery,
} from "@mui/material";
import { FC, ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../Reducers";
import { useAppDispatch } from "../../../store";
import createThemeWithMode from "../../../theme";
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

    // Pre-login screens can't use the dashboard's dark/light setting, so they
    // follow the browser preference instead.
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

    const {
        error: authenticationError,
        isLoading,
        isOffline,
        isSignedIn,
    } = useSelector<RootState, AuthenticationState>(
        (state: RootState) => state.authentication
    );

    useEffect(() => {
        dispatch(fetchAuth({ type: FetchAuthType.Current }));
    }, [dispatch]);

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
    } else if (isOffline) {
        return (
            <StyledEngineProvider injectFirst>
                <MuiThemeProvider
                    theme={createThemeWithMode(
                        prefersDarkMode ? "dark" : "light"
                    )}
                >
                    <CssBaseline />
                    <Container style={{ marginTop: 8 }}>
                        <Alert severity="warning">
                            <AlertTitle>You are offline.</AlertTitle>
                            The application can't continue until you are online.
                        </Alert>
                    </Container>
                </MuiThemeProvider>
            </StyledEngineProvider>
        );
    } else {
        return <>{children}</>;
    }
};

export default AuthenticationProvider;
