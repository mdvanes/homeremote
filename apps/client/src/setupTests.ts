// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

import { GenerateId, StyleSheet } from "jss";

type StyleSheetOptions = StyleSheet["options"];

interface StyleSheetOptionsWithName extends StyleSheetOptions {
    name: string;
}

jest.mock(
    "@material-ui/styles/createGenerateClassName",
    () =>
        (): GenerateId =>
        (rule, styleSheet): string => {
            if (styleSheet) {
                const { options } = styleSheet;
                const { name, classNamePrefix } =
                    options as StyleSheetOptionsWithName;
                return `${name ?? classNamePrefix}-${rule.key}`;
            }
            return rule.key;
        }
);
