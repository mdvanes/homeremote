import React, { FC, FormEvent, useState } from 'react';
import { Button, TextField } from '@material-ui/core';

const AuthenticationProvider: FC = ({ children }) => {
    const [isSignedIn, setIsSignedIn] = useState(
        Boolean(localStorage.getItem('token'))
    );
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const onSubmit = (ev: FormEvent): void => {
        ev.preventDefault();
        fetch('http://localhost:3001/auth/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        })
            .then(data => data.json())
            .then(data => {
                console.log(data);
                localStorage.setItem('token', data.access_token);
                setIsSignedIn(true);
            });
    };
    const logOut = (): void => {
        localStorage.removeItem('token');
        setIsSignedIn(false);
    };
    if (!isSignedIn) {
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
                <Button variant="contained" color="secondary" onClick={logOut}>
                    log out (temp)
                </Button>
            </>
        );
    }
};

export default AuthenticationProvider;
