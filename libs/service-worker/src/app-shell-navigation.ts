// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");

// Decides whether a navigation request should be fulfilled from the cached
// app shell (/index.html) rather than the network. Kept in its own module
// (rather than inline in service-worker.ts) so it can be unit tested without
// loading workbox, which has import-time side effects that require a real
// service worker global scope.
export const isAppShellNavigation = ({
    request,
    url,
}: {
    request: Request;
    url: URL;
}): boolean => {
    // If this isn't a navigation, skip.
    if (request.mode !== "navigate") {
        return false;
    }

    // If this is a URL that starts with /_, skip.
    if (url.pathname.startsWith("/_")) {
        return false;
    }

    // The server's own routes (e.g. GET /auth/oidc, /auth/oidc/callback,
    // /auth/logout) are also full-page navigations, but they are backend
    // endpoints, not client-side SPA routes - none of routes.ts's paths start
    // with /api or /auth. Serving the cached app shell for these instead of
    // hitting the network silently breaks server-driven redirects like the
    // OIDC/SSO login flow, so exempt them.
    if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/auth/")) {
        return false;
    }

    // If this looks like a URL for a resource, because it contains
    // a file extension, skip.
    if (url.pathname.match(fileExtensionRegexp)) {
        return false;
    }

    // Return true to signal that we want to use the handler.
    return true;
};
