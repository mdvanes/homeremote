import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Client, Issuer, Strategy, TokenSet } from "openid-client";
import { User, UsersService } from "../users/users.service";
import {
    DEFAULT_USERNAME_CLAIM,
    getOidcConfig,
    type OidcConfig,
} from "./oidc.config";

export const OIDC_STRATEGY_NAME = "oidc";

export const buildOpenIdClient = async (
    config: OidcConfig
): Promise<Client> => {
    const issuer = await Issuer.discover(config.issuer);
    return new issuer.Client({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uris: [config.callbackUrl],
        response_types: ["code"],
    });
};

@Injectable()
export class OidcStrategy extends PassportStrategy(
    Strategy,
    OIDC_STRATEGY_NAME
) {
    private readonly logger = new Logger(OidcStrategy.name);

    constructor(
        private readonly usersService: UsersService,
        private readonly client: Client,
        private readonly config: OidcConfig
    ) {
        super({
            client,
            params: { scope: config.scope },
            usePKCE: true,
        });
    }

    async validate(tokenset: TokenSet): Promise<User> {
        const claims = tokenset.claims();
        const usernameClaim =
            this.config.usernameClaim ?? DEFAULT_USERNAME_CLAIM;
        let username = claims[usernameClaim] as string | undefined;
        // Some providers (depending on their scope/claim configuration) do not
        // include the profile claims in the ID token. Fall back to the userinfo
        // endpoint before giving up.
        if (!username) {
            username = await this.getUsernameFromUserinfo(
                tokenset,
                usernameClaim
            );
        }
        if (!username) {
            this.logger.error(
                `OIDC token is missing claim "${usernameClaim}". ` +
                    `Claims available in the ID token: ${
                        Object.keys(claims).join(", ") || "(none)"
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
        tokenset: TokenSet,
        usernameClaim: string
    ): Promise<string | undefined> {
        if (!tokenset.access_token) {
            return undefined;
        }
        try {
            const userinfo = await this.client.userinfo(tokenset);
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
        const client = await buildOpenIdClient(config);
        return new OidcStrategy(usersService, client, config);
    },
    inject: [UsersService],
};
