import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { renderHook, waitFor } from "@testing-library/react";
import { FC, ReactNode } from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { jukeboxApi } from "../../../Services/jukeboxApi";
import fetchMock, { enableFetchMocks } from "../../../test/mswFetchMock";
import { useBrowsePathResolver } from "./useBrowsePathResolver";

enableFetchMocks();

const makeStore = () =>
    configureStore({
        reducer: combineReducers({
            [jukeboxApi.reducerPath]: jukeboxApi.reducer,
        }),
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(jukeboxApi.middleware),
    });

const makeWrapper = (
    initialEntries: React.ComponentProps<
        typeof MemoryRouter
    >["initialEntries"] = ["/music/browse"]
): FC<{ children: ReactNode }> => {
    const store = makeStore();
    return ({ children }) => (
        <Provider store={store}>
            <MemoryRouter initialEntries={initialEntries}>
                {children}
            </MemoryRouter>
        </Provider>
    );
};

describe("useBrowsePathResolver", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    it("returns resolved immediately for an empty path", () => {
        const { result } = renderHook(() => useBrowsePathResolver([]), {
            wrapper: makeWrapper(),
        });

        expect(result.current).toEqual({ status: "resolved", entries: [] });
    });

    it("resolves titles to ids level by level via sequential browse calls", async () => {
        fetchMock.mockResponse((req) => {
            if (req.url.endsWith("/browse")) {
                return Promise.resolve(
                    JSON.stringify({
                        status: "received",
                        parentId: null,
                        items: [{ id: "artist1", title: "ABBA", isDir: true }],
                    })
                );
            }
            if (req.url.includes("/browse/artist1")) {
                return Promise.resolve(
                    JSON.stringify({
                        status: "received",
                        parentId: "artist1",
                        items: [{ id: "disc1", title: "Disc 1", isDir: true }],
                    })
                );
            }
            return Promise.resolve(JSON.stringify({ status: "error" }));
        });

        const { result } = renderHook(
            () => useBrowsePathResolver(["ABBA", "Disc 1"]),
            { wrapper: makeWrapper(["/music/browse/ABBA/Disc%201"]) }
        );

        expect(result.current.status).toBe("resolving");

        await waitFor(() => expect(result.current.status).toBe("resolved"));
        expect(result.current.entries).toEqual([
            { id: "artist1", title: "ABBA" },
            { id: "disc1", title: "Disc 1" },
        ]);
    });

    it("returns notFound when a segment's title no longer exists", async () => {
        fetchMock.mockResponse(() =>
            Promise.resolve(
                JSON.stringify({
                    status: "received",
                    parentId: null,
                    items: [{ id: "artist1", title: "ABBA", isDir: true }],
                })
            )
        );

        const { result } = renderHook(
            () => useBrowsePathResolver(["A Deleted Artist"]),
            { wrapper: makeWrapper(["/music/browse/A%20Deleted%20Artist"]) }
        );

        await waitFor(() => expect(result.current.status).toBe("notFound"));
        expect(result.current.entries).toEqual([]);
    });

    it("resolves the first match when sibling titles are duplicated", async () => {
        fetchMock.mockResponse(() =>
            Promise.resolve(
                JSON.stringify({
                    status: "received",
                    parentId: null,
                    items: [
                        {
                            id: "artist1",
                            title: "Various Artists",
                            isDir: true,
                        },
                        {
                            id: "artist2",
                            title: "Various Artists",
                            isDir: true,
                        },
                    ],
                })
            )
        );

        const { result } = renderHook(
            () => useBrowsePathResolver(["Various Artists"]),
            { wrapper: makeWrapper(["/music/browse/Various%20Artists"]) }
        );

        await waitFor(() => expect(result.current.status).toBe("resolved"));
        expect(result.current.entries).toEqual([
            { id: "artist1", title: "Various Artists" },
        ]);
    });

    it("resolves titles with awkward characters like a literal slash", async () => {
        fetchMock.mockResponse(() =>
            Promise.resolve(
                JSON.stringify({
                    status: "received",
                    parentId: null,
                    items: [{ id: "artist1", title: "AC/DC", isDir: true }],
                })
            )
        );

        const { result } = renderHook(() => useBrowsePathResolver(["AC/DC"]), {
            wrapper: makeWrapper(["/music/browse/AC%2FDC"]),
        });

        await waitFor(() => expect(result.current.status).toBe("resolved"));
        expect(result.current.entries).toEqual([
            { id: "artist1", title: "AC/DC" },
        ]);
    });

    it("skips network resolution when router state already carries the resolved path (in-app navigation)", () => {
        fetchMock.mockResponse(() =>
            Promise.reject(
                new Error("should not fetch - state should short-circuit")
            )
        );

        const stateEntries = [{ id: "artist1", title: "ABBA" }];
        const store = makeStore();
        const wrapper: FC<{ children: ReactNode }> = ({ children }) => (
            <Provider store={store}>
                <MemoryRouter
                    initialEntries={[
                        { pathname: "/music/browse/ABBA", state: stateEntries },
                    ]}
                >
                    {children}
                </MemoryRouter>
            </Provider>
        );

        const { result } = renderHook(() => useBrowsePathResolver(["ABBA"]), {
            wrapper,
        });

        expect(result.current).toEqual({
            status: "resolved",
            entries: stateEntries,
        });
        expect(fetchMock).not.toHaveBeenCalled();
    });
});
