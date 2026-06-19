import { UnauthorizedException } from "@nestjs/common";
import { Configuration, fetchUserInfo } from "openid-client";
import { type Mock } from "vitest";
import { StoredUser, UsersService } from "../users/users.service";
import { OidcConfig } from "./oidc.config";
import {
    OidcStrategy,
    OidcTokens,
    oidcStrategyProvider,
} from "./oidc.strategy";

// openid-client v6 exposes userinfo lookup as a standalone function rather than
// a method on the client, so it is mocked at the module level. Everything else
// (notably the real Configuration class, required by the passport Strategy's
// instanceof check) is kept intact via importActual.
vi.mock("openid-client", async (importActual) => {
    const actual = await importActual<typeof import("openid-client")>();
    return {
        ...actual,
        fetchUserInfo: vi.fn(),
    };
});

const serverMetadata = {
    issuer: "https://authentik.example.com",
    authorization_endpoint: "https://authentik.example.com/auth",
    token_endpoint: "https://authentik.example.com/token",
    jwks_uri: "https://authentik.example.com/jwks",
    userinfo_endpoint: "https://authentik.example.com/userinfo",
};

const buildOfflineConfiguration = (): Configuration =>
    new Configuration(serverMetadata, "client-id", "client-secret");

const config: OidcConfig = {
    issuer: "https://authentik.example.com",
    clientId: "client-id",
    clientSecret: "client-secret",
    callbackUrl: "https://app.example.com/auth/oidc/callback",
    scope: "openid profile email",
    usernameClaim: "preferred_username",
};

const makeTokens = (
    claims: Record<string, unknown>,
    accessToken?: string
): OidcTokens =>
    ({
        claims: () => claims,
        access_token: accessToken,
    }) as unknown as OidcTokens;

describe("OidcStrategy", () => {
    let usersService: { findOne: Mock };
    let strategy: OidcStrategy;

    beforeEach(() => {
        vi.mocked(fetchUserInfo).mockReset();
        usersService = { findOne: vi.fn() };
        strategy = new OidcStrategy(
            usersService as unknown as UsersService,
            buildOfflineConfiguration(),
            config
        );
    });

    it("returns the allowlisted user without the password hash", async () => {
        const storedUser: StoredUser = {
            id: 1,
            name: "john",
            displayName: "John",
            hash: "$2b$some_hash",
        };
        usersService.findOne.mockResolvedValue(storedUser);

        const result = await strategy.validate(
            makeTokens({ preferred_username: "john" })
        );

        expect(usersService.findOne).toHaveBeenCalledWith("john");
        expect(result).toEqual({ id: 1, name: "john", displayName: "John" });
        expect(result).not.toHaveProperty("hash");
    });

    it("rejects a user that is not in the allowlist", async () => {
        usersService.findOne.mockResolvedValue(undefined);

        await expect(
            strategy.validate(makeTokens({ preferred_username: "mallory" }))
        ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it("rejects a token missing the username claim", async () => {
        await expect(
            strategy.validate(makeTokens({ sub: "abc" }))
        ).rejects.toBeInstanceOf(UnauthorizedException);
        expect(usersService.findOne).not.toHaveBeenCalled();
        expect(fetchUserInfo).not.toHaveBeenCalled();
    });

    it("falls back to the userinfo endpoint when the ID token lacks the claim", async () => {
        vi.mocked(fetchUserInfo).mockResolvedValue({
            sub: "abc",
            preferred_username: "john",
        } as never);
        const oidcConfiguration = buildOfflineConfiguration();
        const strategyWithUserinfo = new OidcStrategy(
            usersService as unknown as UsersService,
            oidcConfiguration,
            config
        );
        usersService.findOne.mockResolvedValue({
            id: 1,
            name: "john",
            displayName: "John",
            hash: "$2b$some_hash",
        });

        const tokens = makeTokens({ sub: "abc" }, "an-access-token");

        const result = await strategyWithUserinfo.validate(tokens);

        expect(fetchUserInfo).toHaveBeenCalledWith(
            oidcConfiguration,
            "an-access-token",
            "abc"
        );
        expect(usersService.findOne).toHaveBeenCalledWith("john");
        expect(result).toEqual({ id: 1, name: "john", displayName: "John" });
    });

    it("always includes a state parameter in the authorization request", () => {
        // Authentik supports PKCE, so openid-client v6 would otherwise omit the
        // state; we force one so the value Authentik echoes back validates.
        const params = strategy.authorizationRequestParams(
            {} as never,
            {} as never
        );

        const state = params.get("state");
        expect(typeof state).toBe("string");
        expect(state).toBeTruthy();
    });

    it("generates a fresh state for each authorization request", () => {
        const first = strategy
            .authorizationRequestParams({} as never, {} as never)
            .get("state");
        const second = strategy
            .authorizationRequestParams({} as never, {} as never)
            .get("state");

        expect(first).not.toEqual(second);
    });
});

describe("oidcStrategyProvider", () => {
    it("returns null when OIDC is not configured", async () => {
        // The test auth.json has no oidc block, so the factory disables OIDC.
        const result = await oidcStrategyProvider.useFactory({
            findOne: vi.fn(),
        } as unknown as UsersService);
        expect(result).toBeNull();
    });
});
