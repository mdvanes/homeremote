import { ArgumentsHost, Catch, ExceptionFilter, Logger } from "@nestjs/common";
import { Response } from "express";

export const OIDC_LOGIN_ERROR_REDIRECT = "/?error=oidc";

// Builds a single-line description of an error and its `cause` chain. This is
// important for OIDC failures: openid-client v6 wraps the underlying
// oauth4webapi error (e.g. "invalid response encountered") and the real reason
// (a descriptive message such as 'JWT signature verification failed' or
// '"response" body "id_token" property must be a string') only lives on the
// nested `cause`. Each level's `code` is included when present. Non-Error
// causes (oauth4webapi attaches context objects like `{ body }` / `{ claims }`)
// are reduced to their keys so token material is never written to the logs.
export const describeError = (error: unknown): string => {
    const parts: string[] = [];
    let current: unknown = error;
    const seen = new Set<unknown>();

    while (current !== undefined && current !== null && !seen.has(current)) {
        seen.add(current);

        if (current instanceof Error) {
            const code = (current as Error & { code?: unknown }).code;
            parts.push(
                code !== undefined
                    ? `${current.message} [${String(code)}]`
                    : current.message
            );
            current = (current as Error & { cause?: unknown }).cause;
        } else if (typeof current === "object") {
            parts.push(`context keys: {${Object.keys(current).join(", ")}}`);
            break;
        } else {
            parts.push(String(current));
            break;
        }
    }

    return parts.join(" <- ");
};

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
            `OIDC login failed, redirecting to login page: ${describeError(
                exception
            )}`
        );
        response.redirect(OIDC_LOGIN_ERROR_REDIRECT);
    }
}
