import { UnauthorizedException } from "@nestjs/common";
import { Client, Issuer, TokenSet } from "openid-client";
import { type Mock } from "vitest";
import { StoredUser, UsersService } from "../users/users.service";
import { OidcConfig } from "./oidc.config";
import { OidcStrategy, oidcStrategyProvider } from "./oidc.strategy";

const buildOfflineClient = (): Client => {
    const issuer = new Issuer({
        issuer: "https://authentik.example.com",
        authorization_endpoint: "https://authentik.example.com/auth",
        token_endpoint: "https://authentik.example.com/token",
        jwks_uri: "https://authentik.example.com/jwks",
    });
    return new issuer.Client({
        client_id: "client-id",
        client_secret: "client-secret",
        redirect_uris: ["https://app.example.com/auth/oidc/callback"],
        response_types: ["code"],
    });
};

const config: OidcConfig = {
    issuer: "https://authentik.example.com",
    clientId: "client-id",
    clientSecret: "client-secret",
    callbackUrl: "https://app.example.com/auth/oidc/callback",
    scope: "openid profile email",
    usernameClaim: "preferred_username",
};

const makeTokenset = (claims: Record<string, unknown>): TokenSet =>
    ({ claims: () => claims }) as unknown as TokenSet;

describe("OidcStrategy", () => {
    let usersService: { findOne: Mock };
    let strategy: OidcStrategy;

    beforeEach(() => {
        usersService = { findOne: vi.fn() };
        strategy = new OidcStrategy(
            usersService as unknown as UsersService,
            buildOfflineClient(),
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
            makeTokenset({ preferred_username: "john" })
        );

        expect(usersService.findOne).toHaveBeenCalledWith("john");
        expect(result).toEqual({ id: 1, name: "john", displayName: "John" });
        expect(result).not.toHaveProperty("hash");
    });

    it("rejects a user that is not in the allowlist", async () => {
        usersService.findOne.mockResolvedValue(undefined);

        await expect(
            strategy.validate(makeTokenset({ preferred_username: "mallory" }))
        ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it("rejects a token missing the username claim", async () => {
        await expect(
            strategy.validate(makeTokenset({ sub: "abc" }))
        ).rejects.toBeInstanceOf(UnauthorizedException);
        expect(usersService.findOne).not.toHaveBeenCalled();
    });

    it("falls back to the userinfo endpoint when the ID token lacks the claim", async () => {
        const client = buildOfflineClient();
        vi.spyOn(client, "userinfo").mockResolvedValue({
            sub: "abc",
            preferred_username: "john",
        } as never);
        const strategyWithUserinfo = new OidcStrategy(
            usersService as unknown as UsersService,
            client,
            config
        );
        usersService.findOne.mockResolvedValue({
            id: 1,
            name: "john",
            displayName: "John",
            hash: "$2b$some_hash",
        });

        const tokenset = {
            claims: () => ({ sub: "abc" }),
            access_token: "an-access-token",
        } as unknown as TokenSet;

        const result = await strategyWithUserinfo.validate(tokenset);

        expect(client.userinfo).toHaveBeenCalledWith(tokenset);
        expect(usersService.findOne).toHaveBeenCalledWith("john");
        expect(result).toEqual({ id: 1, name: "john", displayName: "John" });
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
