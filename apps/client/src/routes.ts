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
    musicBrowse: "/music/browse",
    musicBrowsePath: "/music/browse/*",
    musicRecent: "/music/recent",
    musicFavorites: "/music/favorites",
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

/**
 * Encode/decode one music browse path segment (an artist/album/directory
 * title). Each segment is encoded independently with `encodeURIComponent` -
 * *not* react-router's `generatePath`/`href`, whose v8.3.0 RFC-3986 escaping
 * lets characters like `&`, `+`, `;` through unescaped and would break the
 * `/`-splitting the splat route relies on. `encodeURIComponent` escapes `/`
 * itself, so titles containing a literal `/` (e.g. "AC/DC") still round-trip
 * as a single path segment.
 */
export const encodeMusicSegment = (title: string): string =>
    encodeURIComponent(title);

export const decodeMusicSegment = (segment: string): string =>
    decodeURIComponent(segment);

/**
 * Builds `/music/browse/<title>/<title>/...` from a resolved browse path.
 * An empty path builds the bare `/music/browse` (artists list) URL.
 */
export const buildMusicBrowsePath = (entries: { title: string }[]): string =>
    entries.length === 0
        ? ROUTES.musicBrowse
        : `${ROUTES.musicBrowse}/${entries
              .map((entry) => encodeMusicSegment(entry.title))
              .join("/")}`;
