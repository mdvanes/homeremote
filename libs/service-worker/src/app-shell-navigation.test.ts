import { describe, expect, it } from "vitest";
import { isAppShellNavigation } from "./app-shell-navigation";

const navigation = (pathname: string): { request: Request; url: URL } => ({
    request: { mode: "navigate" } as Request,
    url: new URL(`https://homeremote.example.com${pathname}`),
});

describe("isAppShellNavigation", () => {
    it("serves the app shell for client-side SPA routes", () => {
        expect(isAppShellNavigation(navigation("/"))).toBe(true);
        expect(isAppShellNavigation(navigation("/music/browse"))).toBe(true);
        expect(isAppShellNavigation(navigation("/services"))).toBe(true);
    });

    // Regression test: the service worker used to swallow full-page
    // navigations to backend routes (e.g. the OIDC/SSO login redirect),
    // serving the cached index.html instead of letting the request reach
    // the server, which silently broke SSO login in production.
    it("exempts backend /auth routes so server redirects (e.g. OIDC/SSO) reach the network", () => {
        expect(isAppShellNavigation(navigation("/auth/oidc"))).toBe(false);
        expect(isAppShellNavigation(navigation("/auth/oidc/callback"))).toBe(
            false
        );
        expect(isAppShellNavigation(navigation("/auth/logout"))).toBe(false);
    });

    it("exempts backend /api routes", () => {
        expect(isAppShellNavigation(navigation("/api/status"))).toBe(false);
    });

    it("exempts non-navigation requests", () => {
        expect(
            isAppShellNavigation({
                request: { mode: "cors" } as Request,
                url: new URL("https://homeremote.example.com/music/browse"),
            })
        ).toBe(false);
    });

    it("exempts requests for files with an extension", () => {
        expect(isAppShellNavigation(navigation("/manifest.json"))).toBe(false);
    });

    it("exempts underscore-prefixed URLs", () => {
        expect(isAppShellNavigation(navigation("/_next/data"))).toBe(false);
    });
});
