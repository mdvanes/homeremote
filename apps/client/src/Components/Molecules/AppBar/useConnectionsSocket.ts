import { useEffect } from "react";
import { io } from "socket.io-client";

const useConnectionsSocket = () => {
    // Websocket Gateway
    useEffect(() => {
        // TODO convert socket.io to rxjs
        const socket = io(`${process.env.NX_BASE_URL}`, {
            // withCredentials: true,
            // auth: {
            //     token: "?",
            // },
        });
        socket.on("connect", function () {
            console.log("Connected");

            socket.emit("events", { test: "test" });
            socket.emit("identity", 0, (response: any) =>
                console.log("Identity:", response)
            );
        });
        socket.on("events", function (data) {
            console.log("event", data);
        });
        socket.on("exception", function (data) {
            console.log("event", data);
        });
        socket.on("disconnect", function () {
            console.log("Disconnected");
        });
    }, []);
};

export default useConnectionsSocket;
