import React, { FC, FormEvent, useEffect, useState } from "react";
import { Button, TextField } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
    AuthenticationState,
    fetchAuth,
    FetchAuthType,
} from "./authenticationSlice";
import { RootState } from "./Reducers";

const AuthenticationProvider: FC = ({ children }) => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const onSubmit = (ev: FormEvent): void => {
        ev.preventDefault();
        dispatch(
            fetchAuth({
                type: FetchAuthType.Login,
                options: {
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
            </form>
        );
    } else {
        return (
            <>
                {children}
                <div>{currentUser}</div>
            </>
        );
    }
};

export default AuthenticationProvider;
