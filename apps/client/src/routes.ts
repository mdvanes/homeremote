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
    serviceLogs: "/services/logs/:id",
    datalora: "/datalora",
    cartwin: "/cartwin",
    energy: "/energy",
    about: "/about",
} as const;

export const buildServiceLogsPath = (containerId: string): string =>
    `${ROUTES.services}/logs/${encodeURIComponent(containerId)}`;
