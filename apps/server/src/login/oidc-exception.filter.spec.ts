import { ArgumentsHost, UnauthorizedException } from "@nestjs/common";
import { Response } from "express";
import {
    OIDC_LOGIN_ERROR_REDIRECT,
    OidcExceptionFilter,
    describeError,
} from "./oidc-exception.filter";

describe("OidcExceptionFilter", () => {
    const buildHost = (response: Partial<Response>): ArgumentsHost =>
        ({
            switchToHttp: () => ({
                getResponse: () => response,
            }),
        }) as unknown as ArgumentsHost;

    it("redirects to the login page with an error flag", () => {
        const redirect = vi.fn();
        const filter = new OidcExceptionFilter();

        filter.catch(new UnauthorizedException(), buildHost({ redirect }));

        expect(redirect).toHaveBeenCalledWith(OIDC_LOGIN_ERROR_REDIRECT);
    });

    it("redirects for any error type", () => {
        const redirect = vi.fn();
        const filter = new OidcExceptionFilter();

        filter.catch(
            new Error("token exchange failed"),
            buildHost({ redirect })
        );

        expect(redirect).toHaveBeenCalledWith(OIDC_LOGIN_ERROR_REDIRECT);
    });
});

describe("describeError", () => {
    it("includes a plain error message", () => {
        expect(describeError(new Error("boom"))).toBe("boom");
    });

    it("non-Error values are stringified", () => {
        expect(describeError("just a string")).toBe("just a string");
    });

    it("walks the cause chain and surfaces the underlying reason and codes", () => {
        const inner = Object.assign(
            new Error('"response" body "id_token" property must be a string'),
            { code: "OAUTH_INVALID_RESPONSE" }
        );
        const wrapped = Object.assign(
            new Error("invalid response encountered", { cause: inner }),
            { code: "OAUTH_INVALID_RESPONSE" }
        );

        expect(describeError(wrapped)).toBe(
            'invalid response encountered [OAUTH_INVALID_RESPONSE] <- "response" body "id_token" property must be a string [OAUTH_INVALID_RESPONSE]'
        );
    });

    it("redacts non-Error cause context to its keys so tokens are not logged", () => {
        const wrapped = new Error("invalid response encountered", {
            cause: { body: { access_token: "secret", id_token: "secret" } },
        });

        expect(describeError(wrapped)).toBe(
            "invalid response encountered <- context keys: {body}"
        );
    });

    it("does not loop on circular cause chains", () => {
        const a = new Error("a");
        const b = new Error("b", { cause: a });
        (a as Error & { cause?: unknown }).cause = b;

        expect(describeError(a)).toBe("a <- b");
    });
});
