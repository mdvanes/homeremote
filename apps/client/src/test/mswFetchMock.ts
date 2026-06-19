import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

/**
 * MSW-backed replacement for jest-fetch-mock.
 *
 * jest-fetch-mock has no maintained Vitest equivalent, so requests are now
 * intercepted by a Mock Service Worker (`msw/node`) server. This module keeps
 * the small jest-fetch-mock API surface the test-suite relied on
 * (`mockResponse`, `mockResponses`, `mockReject`, `resetMocks`/`mockReset` and
 * `fetchMock.mock.calls`/`toHaveBeenCalledTimes`) so the individual tests stay
 * declarative. All successful responses are produced by the MSW server below;
 * only rejections (which need a custom error message that MSW's generic network
 * error cannot express) are raised from the recording `fetch` wrapper.
 */

type ResponseSpec =
    | string
    | {
          body?: string;
          status?: number;
          statusText?: string;
          headers?: HeadersInit;
      };

type Responder =
    | ResponseSpec
    | ((request: Request) => ResponseSpec | Promise<ResponseSpec>);

type Rejection = Error | ((request: Request) => Error | Promise<Error>);

const sequentialResponders: Responder[] = [];
let stickyResponder: Responder | null = null;
let rejection: Rejection | null = null;

const toHttpResponse = (spec: ResponseSpec): Response => {
    if (typeof spec === "string") {
        return new HttpResponse(spec, { status: 200 });
    }
    const { body, ...init } = spec;
    return new HttpResponse(body ?? "", { status: 200, ...init });
};

const catchAllHandler = http.all(/.*/, async ({ request }) => {
    const responder = sequentialResponders.shift() ?? stickyResponder;
    if (responder == null) {
        return new HttpResponse("", { status: 200 });
    }
    const spec =
        typeof responder === "function" ? await responder(request) : responder;
    return toHttpResponse(spec);
});

export const server = setupServer(catchAllHandler);

const fetchSpy = vi.fn();
let interceptedFetch: typeof fetch | undefined;

const recordingFetch = (async (
    input: RequestInfo | URL,
    init?: RequestInit
) => {
    fetchSpy(input, init);
    if (rejection != null) {
        const request = new Request(input as RequestInfo, init);
        throw typeof rejection === "function"
            ? await rejection(request)
            : rejection;
    }
    if (!interceptedFetch) {
        throw new Error("fetch mock used before enableFetchMocks()");
    }
    return interceptedFetch(input, init);
}) as typeof fetch;

const resetState = (): void => {
    sequentialResponders.length = 0;
    stickyResponder = null;
    rejection = null;
    fetchSpy.mockClear();
};

export interface FetchMock {
    mock: { calls: unknown[][] };
    mockResponse(responder: Responder): FetchMock;
    mockResponseOnce(responder: Responder): FetchMock;
    mockResponses(
        ...responders: (Responder | [string, RequestInit?])[]
    ): FetchMock;
    mockReject(error?: Rejection): FetchMock;
    resetMocks(): FetchMock;
    mockReset(): FetchMock;
}

export const fetchMock: FetchMock = Object.assign(fetchSpy, {
    mockResponse(responder: Responder): FetchMock {
        stickyResponder = responder;
        rejection = null;
        return fetchMock;
    },
    mockResponseOnce(responder: Responder): FetchMock {
        sequentialResponders.push(responder);
        return fetchMock;
    },
    mockResponses(
        ...responders: (Responder | [string, RequestInit?])[]
    ): FetchMock {
        for (const responder of responders) {
            sequentialResponders.push(
                Array.isArray(responder) ? responder[0] : responder
            );
        }
        return fetchMock;
    },
    mockReject(error?: Rejection): FetchMock {
        rejection = error ?? new Error("");
        stickyResponder = null;
        return fetchMock;
    },
    resetMocks(): FetchMock {
        resetState();
        return fetchMock;
    },
    mockReset(): FetchMock {
        resetState();
        return fetchMock;
    },
}) as unknown as FetchMock;

/**
 * Starts the MSW server for the current test file and routes the global `fetch`
 * through a recorder so call assertions keep working. Mirrors the lifecycle
 * jest-fetch-mock's `enableFetchMocks()` used to provide.
 */
export const enableFetchMocks = (): void => {
    beforeAll(() => {
        server.listen({ onUnhandledRequest: "bypass" });
        interceptedFetch = globalThis.fetch;
        globalThis.fetch = recordingFetch;
    });
    afterEach(() => {
        server.resetHandlers();
    });
    afterAll(() => {
        server.close();
        if (interceptedFetch) {
            globalThis.fetch = interceptedFetch;
            interceptedFetch = undefined;
        }
    });
};

export default fetchMock;
