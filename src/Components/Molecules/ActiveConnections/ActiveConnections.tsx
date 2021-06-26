/* TODO
                
        Websocket in NestJS
        Websocket: when there is any connection, start polling the backend service, otherwise don't poll

        Use redux-observable
        Use https://www.npmjs.com/package/transmission or https://www.npmjs.com/package/@ctrl/transmission

        */

import { Card, CardContent, CardHeader, Typography } from "@material-ui/core";
import { FC, useEffect, useState } from "react";
// import { io } from "socket.io-client";

// const run = (curr: string[], fn: (x: string[]) => void) => {
const run = (curr: string[], fn: any) => {
    // const socket = io("http://localhost:8080");
    // TODO should work for same domain:

    // const socket = io();
    // setTimeout(() => {
    //     console.log("socket?", socket);
    // }, 2000);

    // socket.emit("events", { test: "test" });

    // socket.on("connect", function () {
    //     console.log("Connected", socket.id);
    //     // console.log(socket.id); // x8WIv7-mJelg7on_ALbx

    //     socket.emit("events", { test: "test" });
    //     socket.emit("identity", 0, (response: any) =>
    //         console.log("Identity:", response)
    //     );
    // });
    // socket.on("events", function (data) {
    //     console.log("event", data);
    // });
    // socket.on("exception", function (data) {
    //     console.log("event", data);
    // });
    // socket.on("disconnect", function () {
    //     console.log("Disconnected");
    // });

    const socket = new WebSocket("ws://localhost:3002/hr-events");
    socket.onopen = function () {
        console.log("Connected");
        socket.send(
            JSON.stringify({
                event: "events",
                data: "test",
            })
        );
        socket.onmessage = function (data) {
            console.log(data.data);
            fn((x: string[]) => x.concat(data.data));
        };
    };
};

// TODO fix servername and portnumber
// TODO fix fallback when connection to ws not available
// TODO use RTK Query for Observable

const ActiveConnections: FC = () => {
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        run(messages, setMessages);
    }, []);

    return (
        <Card style={{ marginTop: 10 }}>
            <CardHeader title="Active connections" />
            <CardContent>
                <Typography>Active connections (WIP)</Typography>
                <ul>
                    {messages.map((m) => (
                        <li key={m}>{m}</li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
};

export default ActiveConnections;
