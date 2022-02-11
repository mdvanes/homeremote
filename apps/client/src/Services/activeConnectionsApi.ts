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
            query: (channel) => "/api/downloadlist", // `messages/${channel}`, // This is a normal http request to set initial state? If "" is used, it will reject the thunk
            async onCacheEntryAdded(
                arg,
                {
                    updateCachedData,
                    cacheDataLoaded,
                    cacheEntryRemoved,
                    getCacheEntry,
                }
            ) {
                // create a websocket connection when the cache subscription starts
                const ws = new WebSocket("ws://localhost:3002/hr-events");
                console.log("new ws in api", ws);

                // TODO this should not be needed when cacheDataLoaded is passed. Can't find a working example
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
                    // await getCacheEntry();
                    // wait for the initial query to resolve before proceeding
                    await cacheDataLoaded;
                    console.log("cacheDataLoaded");

                    // when data is received from the socket connection to the server,
                    // if it is a message and for the appropriate channel,
                    // update our query result with the received message
                    const listener = (event: MessageEvent) => {
                        const data = JSON.parse(event.data);
                        // TODO this is not reached immediately, but only when another browser window triggers a message
                        console.log("activeConnectionsApi", data);
                        // if (!isMessage(data) || data.channel !== arg) return;

                        updateCachedData((draft) => {
                            console.log(draft);
                            // TODO this does not work
                            // draft = data;
                            // TODO why draft.push not available?
                            // if (draft.push) {
                            //     draft.push(data);
                            // }
                            // draft.push(data);
                            /*
                            Uncaught TypeError: draft.push is not a function
    at activeConnectionsApi.ts:65
    at e.produce (immerClass.ts:94)
    at e.produceWithPatches (immerClass.ts:131)
    at rtk-query.esm.js:620
    at index.js:8
    at redux-toolkit.esm.js:314
    at Object.dispatch (redux.js:659)
    at __spreadProps.updateCachedData (rtk-query.esm.js:1302)
    at WebSocket.listener (activeConnectionsApi.ts:57)

                            */
                        });
                    };

                    ws.addEventListener("message", listener);
                    console.log("addEventListener");

                    // ws.send(
                    //     JSON.stringify({
                    //         event: "events",
                    //         data: "test",
                    //     })
                    // );
                } catch (err) {
                    // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
                    // in which case `cacheDataLoaded` will throw
                    console.log("catch", err);
                }
                // cacheEntryRemoved will resolve when the cache subscription is no longer active
                await cacheEntryRemoved;
                console.log("cacheEntryRemoved");
                // perform cleanup steps once the `cacheEntryRemoved` promise resolves
                ws.close();
            },
        }),
    }),
});

export const { useGetMessagesQuery } = activeConnectionsApi;
