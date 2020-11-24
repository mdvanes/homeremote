import React, { FC, FormEvent, useEffect, useState } from "react";
import { Button, TextField } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { useDispatch, useSelector } from "react-redux";
import {
    AuthenticationState,
    fetchAuth,
    FetchAuthType,
} from "./authenticationSlice";
import { RootState } from "../../../Reducers";

// TODO use flap/1 to login
// TODO show error when using wrong user/password

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

    const currentUser = useSelector<RootState, AuthenticationState["name"]>(
        (state: RootState) => state.authentication.name
    );

    const errorMessage = useSelector<RootState, AuthenticationState["error"]>(
        (state: RootState) => state.authentication.error
    );

    useEffect(() => {
        dispatch(fetchAuth({ type: FetchAuthType.Current }));
    }, [dispatch]);

    if (currentUser === "") {
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
                <Button type="submit" variant="contained" color="primary">
                    Log in
                </Button>
                {errorMessage.toString().indexOf("login") > -1 && (
                    <Alert severity="error">{errorMessage}</Alert>
                )}
            </form>
        );
    } else {
        return <>{children}</>;
    }
};

export default AuthenticationProvider;
