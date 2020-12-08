import React, { FC, FormEvent, useEffect, useState } from "react";
import { Button, TextField } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useDispatch, useSelector } from "react-redux";
import {
    AuthenticationState,
    fetchAuth,
    FetchAuthType,
} from "./authenticationSlice";
import { RootState } from "../../../Reducers";
import AppSkeleton from "../../Molecules/AppSkeleton/AppSkeleton";

const LOGIN_ENDPOINT = "/auth/login";
const UNAUTHORIZED_MESSAGE = `${LOGIN_ENDPOINT} Unauthorized`;

const AuthenticationProvider: FC = ({ children }) => {
    const dispatch = useDispatch();
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

    const currentUser = useSelector<
        RootState,
        AuthenticationState["displayName"]
    >((state: RootState) => state.authentication.displayName);

    const authenticationError = useSelector<
        RootState,
        AuthenticationState["error"]
    >((state: RootState) => state.authentication.error);

    const isLoading = useSelector<RootState, AuthenticationState["isLoading"]>(
        (state: RootState) => state.authentication.isLoading
    );

    useEffect(() => {
        dispatch(fetchAuth({ type: FetchAuthType.Current }));
    }, [dispatch]);

    // TODO Refactor to move logic to slice, when the "offline" status must be added
    const errorMessageAlert = authenticationError &&
        authenticationError.indexOf(LOGIN_ENDPOINT) > -1 && (
            <Alert severity="error">
                {authenticationError.indexOf(UNAUTHORIZED_MESSAGE) > -1
                    ? "Invalid username/password"
                    : authenticationError}
            </Alert>
        );

    if (currentUser === "" && isLoading) {
        return <AppSkeleton />;
    } else if (currentUser === "") {
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
    } else {
        return <>{children}</>;
    }
};

export default AuthenticationProvider;
