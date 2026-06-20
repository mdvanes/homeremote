import { http, HttpResponse } from "msw";

const DEMO_USER = {
    id: 1,
    displayName: "John",
    loginMethod: "local" as const,
};

/**
 * Auto-"authenticates" the demo: profile/current and login report a signed-in
 * user, logout clears it (returning to the login screen), and OIDC is disabled.
 */
export const authHandlers = [
    http.get("*/api/profile/current", () => HttpResponse.json(DEMO_USER)),
    http.post("*/auth/login", () => HttpResponse.json(DEMO_USER)),
    http.get("*/auth/logout", () =>
        HttpResponse.json({ id: 0, displayName: "" })
    ),
    http.get("*/auth/config", () =>
        HttpResponse.json({ oidc: { enabled: false } })
    ),
];
