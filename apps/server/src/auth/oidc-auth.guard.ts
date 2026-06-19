import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { OIDC_STRATEGY_NAME } from "./oidc.strategy";

@Injectable()
export class OidcAuthGuard extends AuthGuard(OIDC_STRATEGY_NAME) {}
