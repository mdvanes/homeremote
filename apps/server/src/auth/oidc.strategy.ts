import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {
    Configuration,
    discovery,
    fetchUserInfo,
    skipSubjectCheck,
    type TokenEndpointResponse,
    type TokenEndpointResponseHelpers,
} from "openid-client";
import { Strategy } from "openid-client/passport";
import { User, UsersService } from "../users/users.service";
import {
    DEFAULT_USERNAME_CLAIM,
    getOidcConfig,
    type OidcConfig,
} from "./oidc.config";

export const OIDC_STRATEGY_NAME = "oidc";

// The token endpoint response passed to the verify callback, with the helper
// methods (claims(), expiresIn()) openid-client v6 attaches to it.
export type OidcTokens = TokenEndpointResponse & TokenEndpointResponseHelpers;

// Discovers the authorization server metadata and builds an openid-client
// Configuration. In v6 the Issuer/Client classes are replaced by a functional
// API where a single Configuration carries both server and client metadata.
export const buildOpenIdConfiguration = (
    config: OidcConfig
): Promise<Configuration> =>
    discovery(new URL(config.issuer), config.clientId, config.clientSecret);

@Injectable()
export class OidcStrategy extends PassportStrategy(
    Strategy,
    OIDC_STRATEGY_NAME
) {
    private readonly logger = new Logger(OidcStrategy.name);

    constructor(
        private readonly usersService: UsersService,
        private readonly oidcConfiguration: Configuration,
        private readonly config: OidcConfig
    ) {
        super({
            config: oidcConfiguration,
            name: OIDC_STRATEGY_NAME,
            scope: config.scope,
            callbackURL: config.callbackUrl,
        });
    }

    async validate(tokens: OidcTokens): Promise<User> {
        const claims = tokens.claims();
        const usernameClaim =
            this.config.usernameClaim ?? DEFAULT_USERNAME_CLAIM;
        let username = claims?.[usernameClaim] as string | undefined;
        // Some providers (depending on their scope/claim configuration) do not
        // include the profile claims in the ID token. Fall back to the userinfo
        // endpoint before giving up.
        if (!username) {
            username = await this.getUsernameFromUserinfo(
                tokens,
                usernameClaim
            );
        }
        if (!username) {
            this.logger.error(
                `OIDC token is missing claim "${usernameClaim}". ` +
                    `Claims available in the ID token: ${
                        claims
                            ? Object.keys(claims).join(", ") || "(none)"
                            : "(none)"
                    }. ` +
                    `Check the provider's scope/claim mapping or set "usernameClaim" in auth.json.`
            );
            throw new UnauthorizedException();
        }
        // Allowlist: only users present in auth.json may sign in via SSO.
        const user = await this.usersService.findOne(username);
        if (!user) {
            this.logger.error(
                `OIDC user "${username}" is not in the auth.json allowlist`
            );
            throw new UnauthorizedException();
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { hash, ...userWithoutHash } = user;
        return userWithoutHash;
    }

    // Looks up the username from the OIDC userinfo endpoint, used when the
    // claim is not present in the ID token. Returns undefined on any failure so
    // the caller can surface a single UnauthorizedException.
    private async getUsernameFromUserinfo(
        tokens: OidcTokens,
        usernameClaim: string
    ): Promise<string | undefined> {
        if (!tokens.access_token) {
            return undefined;
        }
        try {
            const expectedSubject = tokens.claims()?.sub ?? skipSubjectCheck;
            const userinfo = await fetchUserInfo(
                this.oidcConfiguration,
                tokens.access_token,
                expectedSubject
            );
            return userinfo[usernameClaim] as string | undefined;
        } catch (err) {
            this.logger.error(
                `OIDC userinfo lookup failed: ${
                    err instanceof Error ? err.message : String(err)
                }`
            );
            return undefined;
        }
    }
}

export const OIDC_STRATEGY_TOKEN = "OIDC_STRATEGY";

export const oidcStrategyProvider = {
    provide: OIDC_STRATEGY_TOKEN,
    useFactory: async (
        usersService: UsersService
    ): Promise<OidcStrategy | null> => {
        const config = getOidcConfig();
        if (!config) {
            // OIDC is optional: when not configured the strategy is not registered.
            return null;
        }
        const oidcConfiguration = await buildOpenIdConfiguration(config);
        return new OidcStrategy(usersService, oidcConfiguration, config);
    },
    inject: [UsersService],
};
