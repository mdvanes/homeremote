import {
    Alert,
    Button,
    CssBaseline,
    Divider,
    ThemeProvider as MuiThemeProvider,
    StyledEngineProvider,
    TextField,
    useMediaQuery,
} from "@mui/material";
import { FC, FormEvent, ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../Reducers";
import { redirectTo } from "../../../navigation";
import { useAppDispatch } from "../../../store";
import createThemeWithMode from "../../../theme";
import {
    AuthenticationState,
    fetchAuth,
    fetchAuthConfig,
    FetchAuthType,
} from "./authenticationSlice";

const OIDC_LOGIN_PATH = "/auth/oidc";

interface LoginPageProps {
    errorMessage?: ReactNode;
}

const LoginPage: FC<LoginPageProps> = ({ errorMessage }) => {
    const dispatch = useAppDispatch();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // The login page is shown before authentication, so it can't use the
    // dashboard's dark/light setting. Derive it from the browser preference.
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const theme = createThemeWithMode(prefersDarkMode ? "dark" : "light");

    const { oidcEnabled } = useSelector<RootState, AuthenticationState>(
        (state: RootState) => state.authentication
    );

    useEffect(() => {
        dispatch(fetchAuthConfig());
    }, [dispatch]);

    const onSubmit = (ev: FormEvent): void => {
        ev.preventDefault();
        dispatch(
            fetchAuth({
                type: FetchAuthType.Login,
                init: {
                    method: "POST",
                    body: JSON.stringify({
                        username,
                        password,
                    }),
                },
            })
        );
    };

    const onAuthentikLogin = (): void => {
        // OIDC requires a full-page redirect through the browser.
        redirectTo(`${process.env.NX_PUBLIC_BASE_URL}${OIDC_LOGIN_PATH}`);
    };

    return (
        <StyledEngineProvider injectFirst>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <form id="form" onSubmit={onSubmit} style={{ margin: 8 }}>
                    <TextField
                        label="Username"
                        variant="outlined"
                        onChange={(ev): void => setUsername(ev.target.value)}
                        fullWidth
                        style={{ marginBottom: 8 }}
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        onChange={(ev): void => setPassword(ev.target.value)}
                        fullWidth
                        style={{ marginBottom: 8 }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{ marginBottom: 8 }}
                    >
                        Log in
                    </Button>
                    {oidcEnabled ? (
                        <>
                            <Divider style={{ marginBottom: 8 }}>or</Divider>
                            <Button
                                type="button"
                                variant="outlined"
                                color="primary"
                                fullWidth
                                onClick={onAuthentikLogin}
                                style={{ marginBottom: 8 }}
                            >
                                Log in with Authentik
                            </Button>
                        </>
                    ) : (
                        <Alert severity="info" style={{ marginBottom: 8 }}>
                            Single sign-on (OIDC) is not configured. You can
                            enable login with Authentik &mdash; see the
                            &quot;SSO / OIDC login with Authentik&quot; section
                            in the README.
                        </Alert>
                    )}
                    {errorMessage}
                </form>
            </MuiThemeProvider>
        </StyledEngineProvider>
    );
};

export default LoginPage;
