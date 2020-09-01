import React, { FC, FormEvent, useState } from 'react';
import { Button } from '@material-ui/core';

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
            <form id="form" onSubmit={onSubmit}>
                <input
                    type="text"
                    name="username"
                    id="username"
                    onChange={(ev): void => setUsername(ev.target.value)}
                />
                <input
                    type="password"
                    name="password"
                    id="password"
                    onChange={(ev): void => setPassword(ev.target.value)}
                />
                <input type="submit" />
            </form>
        );
    } else {
        return (
            <>
                {children}
                <Button onClick={logOut}>log out (temp)</Button>
            </>
        );
    }
};

export default AuthenticationProvider;
