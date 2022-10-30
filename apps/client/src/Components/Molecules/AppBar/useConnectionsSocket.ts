import { useEffect } from "react";
import { io } from "socket.io-client";

const useConnectionsSocket = () => {
    // Websocket Gateway
    useEffect(() => {
        console.log("NX_BASE_URL=", process.env.NX_BASE_URL);
        // const url = "ws://localhost:4202";
        const url = "ws://localhost:3333";
        // const url = "http://localhost:3333";

        // const socket = new WebSocket(`${process.env.NX_BASE_URL}`);
        const socket = new WebSocket(url);

        socket.onopen = function (e) {
            console.log("[open] Connection established");
            console.log("Sending to server");
            socket.send("My name is John");
            //
            // socket.emit("events", { test: "test" });
            socket.send(
                JSON.stringify({
                    event: "events",
                    data: "test",
                })
            );

            socket.send(
                JSON.stringify({
                    event: "active",
                    data: "test",
                })
            );
        };

        socket.onmessage = function (event) {
            console.log(`[message] Data received from server: ${event.data}`);
        };

        socket.onclose = function (event) {
            if (event.wasClean) {
                console.log(
                    `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
                );
            } else {
                // e.g. server process killed or network down
                // event.code is usually 1006 in this case
                console.log("[close] Connection died");
            }
        };

        socket.onerror = function (error) {
            console.log(`[error]`);
        };

        // TODO convert socket.io to rxjs
        // const url = process.env.NX_BASE_URL ?? "";
        // // const url = "ws://localhost:4202";
        // // const url = "ws://localhost:3333";
        // const socket = io(url, {
        //     // withCredentials: true,
        //     // auth: {
        //     //     token: "?",
        //     // },
        // });
        // socket.on("connect", function () {
        //     console.log("Connected");

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
    }, []);
};

export default useConnectionsSocket;
