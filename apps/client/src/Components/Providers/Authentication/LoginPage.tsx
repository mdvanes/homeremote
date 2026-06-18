import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CssBaseline,
    Divider,
    ThemeProvider as MuiThemeProvider,
    Stack,
    StyledEngineProvider,
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LoginIcon from "@mui/icons-material/Login";
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
                <Box
                    sx={{
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 2,
                        background: (t) =>
                            `linear-gradient(160deg, ${t.palette.background.default} 0%, ${t.palette.background.paper} 100%)`,
                    }}
                >
                    <Card
                        elevation={8}
                        sx={{
                            width: "100%",
                            maxWidth: 420,
                            borderRadius: 3,
                        }}
                    >
                        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                            <Stack
                                spacing={1}
                                sx={{ alignItems: "center", mb: 3 }}
                            >
                                <Avatar
                                    sx={{
                                        bgcolor: "primary.main",
                                        width: 56,
                                        height: 56,
                                    }}
                                >
                                    <LockOutlinedIcon fontSize="large" />
                                </Avatar>
                                <Typography
                                    variant="h5"
                                    component="h1"
                                    sx={{ fontWeight: 600 }}
                                >
                                    Home Remote
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Sign in to continue
                                </Typography>
                            </Stack>
                            <Box
                                component="form"
                                id="form"
                                onSubmit={onSubmit}
                            >
                                <Stack spacing={2}>
                                    <TextField
                                        label="Username"
                                        variant="outlined"
                                        autoComplete="username"
                                        autoFocus
                                        onChange={(ev): void =>
                                            setUsername(ev.target.value)
                                        }
                                        fullWidth
                                    />
                                    <TextField
                                        label="Password"
                                        variant="outlined"
                                        type="password"
                                        autoComplete="current-password"
                                        onChange={(ev): void =>
                                            setPassword(ev.target.value)
                                        }
                                        fullWidth
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        fullWidth
                                        startIcon={<LoginIcon />}
                                    >
                                        Log in
                                    </Button>
                                    {oidcEnabled ? (
                                        <>
                                            <Divider>or</Divider>
                                            <Button
                                                type="button"
                                                variant="outlined"
                                                color="primary"
                                                size="large"
                                                fullWidth
                                                onClick={onAuthentikLogin}
                                            >
                                                Log in with Authentik
                                            </Button>
                                        </>
                                    ) : (
                                        <Alert severity="info">
                                            Single sign-on (OIDC) is not
                                            configured. You can enable login
                                            with Authentik &mdash; see the
                                            &quot;SSO / OIDC login with
                                            Authentik&quot; section in the
                                            README.
                                        </Alert>
                                    )}
                                    {errorMessage}
                                </Stack>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </MuiThemeProvider>
        </StyledEngineProvider>
    );
};

export default LoginPage;
