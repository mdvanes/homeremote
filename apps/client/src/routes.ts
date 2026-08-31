/**
 * Central definition of all client routes: the path patterns registered with
 * react-router (for `<Route path=...>`) and typed builder functions that
 * construct concrete URLs (for `<Link to=...>` / `navigate()`). No component
 * should hand-build a route string; import from here instead.
 */

export const ROUTES = {
    home: "/",
    dashboard: "/dashboard",
    music: "/music",
    gears: "/gears",
    docker: "/docker",
    caddy: "/caddy",
    services: "/services",
    serviceStack: "/services/:stackName",
    serviceStackLogs: "/services/:stackName/logs/:containerId",
    datalora: "/datalora",
    cartwin: "/cartwin",
    energy: "/energy",
    about: "/about",
} as const;

/**
 * A stack "name segment" is just the stack's Name, URL-encoded. Encoded as a
 * single path segment (not with `encodeURIComponent`'s stricter escaping) so
 * common punctuation in Portainer stack names round-trips predictably.
 */
export const buildServicesStackPath = (stackName: string): string =>
    `${ROUTES.services}/${encodeURIComponent(stackName)}`;

export const buildServicesStackLogsPath = (
    stackName: string,
    containerId: string
): string =>
    `${buildServicesStackPath(stackName)}/logs/${encodeURIComponent(
        containerId
    )}`;
