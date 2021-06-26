import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Channel = "redux" | "general";

export interface Message {
    id: number;
    channel: Channel;
    userName: string;
    text: string;
}

export const activeConnectionsApi = createApi({
    reducerPath: "activeConnectionsApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/" }),
    endpoints: (builder) => ({
        getMessages: builder.query<Message[], Channel>({
            query: (channel) => `messages/${channel}`,
            async onCacheEntryAdded(
                arg,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                // create a websocket connection when the cache subscription starts
                const ws = new WebSocket("ws://localhost:3002/hr-events"); // ws://localhost:3002/hr-events
                console.log("new ws in api", ws);

                // ws.onopen = () => {
                //     ws.send(
                //         JSON.stringify({
                //             event: "events",
                //             data: "test",
                //         })
                //     );
                // };

                try {
                    console.log("before cacheDataLoaded");
                    // wait for the initial query to resolve before proceeding
                    await cacheDataLoaded;
                    // TODO this is never reached
                    console.log("cacheDataLoaded");

                    // when data is received from the socket connection to the server,
                    // if it is a message and for the appropriate channel,
                    // update our query result with the received message
                    const listener = (event: MessageEvent) => {
                        const data = JSON.parse(event.data);
                        console.log("activeConnectionsApi", data);
                        // if (!isMessage(data) || data.channel !== arg) return;

                        updateCachedData((draft) => {
                            draft.push(data);
                        });
                    };

                    ws.addEventListener("message", listener);
                    console.log("addEventListener");

                    ws.send(
                        JSON.stringify({
                            event: "events",
                            data: "test",
                        })
                    );
                } catch {
                    // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
                    // in which case `cacheDataLoaded` will throw
                    console.log("catch");
                }
                // cacheEntryRemoved will resolve when the cache subscription is no longer active
                await cacheEntryRemoved;
                // perform cleanup steps once the `cacheEntryRemoved` promise resolves
                ws.close();
            },
        }),
    }),
});

export const { useGetMessagesQuery } = activeConnectionsApi;
