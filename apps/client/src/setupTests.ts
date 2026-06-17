// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// react-router v7 references TextEncoder/TextDecoder at module load time,
// but the jsdom test environment does not expose them as globals.
import { TextDecoder, TextEncoder } from "util";

if (typeof global.TextEncoder === "undefined") {
    global.TextEncoder = TextEncoder as typeof global.TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
    global.TextDecoder = TextDecoder as typeof global.TextDecoder;
}

// import { GenerateId, StyleSheet } from "jss";
// type StyleSheetOptions = StyleSheet["options"];
// interface StyleSheetOptionsWithName extends StyleSheetOptions {
//     name: string;
// }
// jest.mock(
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
window.fetch = jest.fn();
