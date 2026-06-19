import { ArgumentsHost, Catch, ExceptionFilter, Logger } from "@nestjs/common";
import { Response } from "express";

export const OIDC_LOGIN_ERROR_REDIRECT = "/?error=oidc";

// When OIDC login fails (e.g. the user is not in the allowlist, the provider
// rejects the request, or the session/state could not be validated), redirect
// the browser back to the login page with an error flag so the SPA can show a
// friendly message, instead of returning a bare 401 JSON response.
@Catch()
export class OidcExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(OidcExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const response = host.switchToHttp().getResponse<Response>();
        this.logger.error(
            `OIDC login failed, redirecting to login page: ${
                exception instanceof Error
                    ? exception.message
                    : String(exception)
            }`
        );
        response.redirect(OIDC_LOGIN_ERROR_REDIRECT);
    }
}
