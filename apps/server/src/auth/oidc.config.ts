import { getAuthConfig } from "./constants";

export interface OidcConfig {
    issuer: string;
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
    scope?: string;
    usernameClaim?: string;
}

export const DEFAULT_OIDC_SCOPE = "openid profile email";
export const DEFAULT_USERNAME_CLAIM = "preferred_username";

const hasRequiredFields = (oidc: Partial<OidcConfig> | undefined): boolean =>
    Boolean(
        oidc &&
        oidc.issuer &&
        oidc.clientId &&
        oidc.clientSecret &&
        oidc.callbackUrl
    );

export const getOidcConfig = (): OidcConfig | null => {
    const oidc = getAuthConfig().oidc as Partial<OidcConfig> | undefined;
    if (!hasRequiredFields(oidc)) {
        return null;
    }
    return {
        scope: DEFAULT_OIDC_SCOPE,
        usernameClaim: DEFAULT_USERNAME_CLAIM,
        ...(oidc as OidcConfig),
    };
};

export const isOidcEnabled = (): boolean => getOidcConfig() !== null;
