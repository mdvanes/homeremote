/**
 * Offline-friendly placeholder images as inline SVG data URIs, so the demo never
 * depends on external image hosts. Used for album/cover art, radio logos and
 * "next up" thumbnails.
 */

const PALETTE = [
    "#1f6feb",
    "#238636",
    "#8957e5",
    "#db61a2",
    "#e3b341",
    "#f0883e",
    "#2d6196",
    "#66bb6a",
];

const colorFor = (seed: string): string => {
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
        hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }
    return PALETTE[hash % PALETTE.length];
};

const escapeXml = (value: string): string =>
    value.replace(/[<>&]/g, (c) =>
        c === "<" ? "&lt;" : c === ">" ? "&gt;" : "&amp;"
    );

export const svgMarkup = (label: string, width = 300, height = 300): string => {
    const initials = escapeXml(
        label
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((w) => w[0]?.toUpperCase() ?? "")
            .join("") || "♪"
    );
    const bg = colorFor(label);
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="${bg}"/><text x="50%" y="50%" dy=".35em" fill="#ffffff" font-family="Roboto, Arial, sans-serif" font-size="${Math.round(
        Math.min(width, height) / 3
    )}" font-weight="600" text-anchor="middle">${initials}</text></svg>`;
};

export const svgDataUri = (label: string, width = 300, height = 300): string =>
    `data:image/svg+xml;utf8,${encodeURIComponent(
        svgMarkup(label, width, height)
    )}`;

/** A 1x1 transparent PNG, used as a stub for binary media (cover art, audio). */
export const TRANSPARENT_PNG = Uint8Array.from(
    atob(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    ),
    (c) => c.charCodeAt(0)
);
