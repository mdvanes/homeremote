// jest-dom adds custom matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/vitest";

// react-router v7 references TextEncoder/TextDecoder at module load time,
// but the jsdom test environment does not expose them as globals.
import { TextDecoder, TextEncoder } from "util";

if (typeof global.TextEncoder === "undefined") {
    global.TextEncoder = TextEncoder as typeof global.TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
    global.TextDecoder = TextDecoder as typeof global.TextDecoder;
}

// The global Request in the test runtime (Node/undici) rejects relative URLs,
// while RTK Query builds requests from a relative `baseUrl` ("/"). jsdom does
// not provide a browser Request that resolves them against `location`, so we
// wrap Request to absolutize relative URLs (allowing both construction and MSW
// interception) while preserving the original URL on `__rawUrl` for the
// request-introspection test helpers.
const NativeRequest = globalThis.Request;
const RAW_URL = "__rawUrl";

class TestRequest extends NativeRequest {
    constructor(input: RequestInfo | URL, init?: RequestInit) {
        const rawUrl =
            typeof input === "string"
                ? input
                : input instanceof URL
                  ? input.toString()
                  : input.url;
        const isAbsolute = /^[a-z][a-z\d+.-]*:\/\//i.test(rawUrl);
        const resolvedInput = isAbsolute
            ? input
            : `http://localhost${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;
        super(resolvedInput as RequestInfo, init);
        Object.defineProperty(this, RAW_URL, {
            value: rawUrl,
            enumerable: false,
            writable: false,
            configurable: true,
        });
    }
}

globalThis.Request = TestRequest as typeof Request;

// import { GenerateId, StyleSheet } from "jss";
// type StyleSheetOptions = StyleSheet["options"];
// interface StyleSheetOptionsWithName extends StyleSheetOptions {
//     name: string;
// }
// vi.mock(
//     "@mui/styles/createGenerateClassName",
//     () =>
//         (): GenerateId =>
//         (rule, styleSheet): string => {
//             if (styleSheet) {
//                 const { options } = styleSheet;
//                 const { name, classNamePrefix } =
//                     options as StyleSheetOptionsWithName;
//                 return `${name ?? classNamePrefix}-${rule.key}`;
//             }
//             return rule.key;
//         }
// );

// Polyfill Fetch API in Node for Jest
window.fetch = vi.fn();
