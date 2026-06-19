import { ArgumentsHost, UnauthorizedException } from "@nestjs/common";
import { Response } from "express";
import {
    OIDC_LOGIN_ERROR_REDIRECT,
    OidcExceptionFilter,
} from "./oidc-exception.filter";

describe("OidcExceptionFilter", () => {
    const buildHost = (response: Partial<Response>): ArgumentsHost =>
        ({
            switchToHttp: () => ({
                getResponse: () => response,
            }),
        }) as unknown as ArgumentsHost;

    it("redirects to the login page with an error flag", () => {
        const redirect = jest.fn();
        const filter = new OidcExceptionFilter();

        filter.catch(new UnauthorizedException(), buildHost({ redirect }));

        expect(redirect).toHaveBeenCalledWith(OIDC_LOGIN_ERROR_REDIRECT);
    });

    it("redirects for any error type", () => {
        const redirect = jest.fn();
        const filter = new OidcExceptionFilter();

        filter.catch(
            new Error("token exchange failed"),
            buildHost({ redirect })
        );

        expect(redirect).toHaveBeenCalledWith(OIDC_LOGIN_ERROR_REDIRECT);
    });
});
