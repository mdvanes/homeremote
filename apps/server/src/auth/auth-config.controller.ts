import { Controller, Get } from "@nestjs/common";
import { isOidcEnabled } from "../auth/oidc.config";

export interface AuthConfigResponse {
    oidc: {
        enabled: boolean;
    };
}

@Controller("auth/config")
export class AuthConfigController {
    // Public: lets the client decide whether to render the "Log in with Authentik" button.
    @Get()
    getConfig(): AuthConfigResponse {
        return { oidc: { enabled: isOidcEnabled() } };
    }
}
