import { Alert, AlertTitle } from "@mui/lab";
import { Button, Container, TextField } from "@mui/material";
import { FC, FormEvent, ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../Reducers";
import { useAppDispatch } from "../../../store";
import AppSkeleton from "../../Molecules/AppSkeleton/AppSkeleton";
import {
    AuthenticationState,
    FetchAuthType,
    fetchAuth,
} from "./authenticationSlice";

const LOGIN_ENDPOINT = "/auth/login";
const UNAUTHORIZED_MESSAGE = `${LOGIN_ENDPOINT} Unauthorized`;

const AuthenticationProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
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
        return (
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
                {errorMessageAlert}
            </form>
        );
    } else if (isOffline) {
        return (
            <Container style={{ marginTop: 8 }}>
                <Alert severity="warning">
                    <AlertTitle>You are offline.</AlertTitle>
                    The application can't continue until you are online.
                </Alert>
            </Container>
        );
    } else {
        return <>{children}</>;
    }
};

export default AuthenticationProvider;
