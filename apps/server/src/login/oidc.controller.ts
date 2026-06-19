import {
    Controller,
    Get,
    Logger,
    Req,
    Res,
    UseFilters,
    UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "../auth/auth.service";
import { OidcAuthGuard } from "../auth/oidc-auth.guard";
import type { LoginRequest } from "./LoginRequest.types";
import { OidcExceptionFilter } from "./oidc-exception.filter";

@Controller("auth/oidc")
@UseFilters(OidcExceptionFilter)
export class OidcController {
    private readonly logger: Logger;

    constructor(private readonly authService: AuthService) {
        this.logger = new Logger(OidcController.name);
    }

    // Initiates the OIDC flow: the guard redirects the browser to Authentik.
    @UseGuards(OidcAuthGuard)
    @Get()
    async login(): Promise<void> {
        // Intentionally empty: OidcAuthGuard handles the redirect to Authentik.
    }

    // Authentik redirects back here; the guard validates and populates req.user.
    @UseGuards(OidcAuthGuard)
    @Get("callback")
    async callback(
        @Req() req: LoginRequest,
        @Res() res: Response
    ): Promise<void> {
        this.logger.verbose(`oidc callback: ${JSON.stringify(req.user)}`);
        const cookie = this.authService.getCookieWithJwtToken(req.user);
        res.cookie(...cookie);
        res.redirect("/");
    }
}
