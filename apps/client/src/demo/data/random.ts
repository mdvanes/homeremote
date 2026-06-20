/**
 * Tiny, dependency-free pseudo-random helpers for demo mode.
 *
 * A seeded generator keeps "static" fixtures (entity names, ids, service links)
 * stable within a session so the demo doesn't flicker between renders, while
 * time-based generators (charts) still produce lively, trending data.
 */

// mulberry32: small, fast, deterministic PRNG.
const mulberry32 = (seed: number): (() => number) => {
    let a = seed >>> 0;
    return () => {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
};

/** Default shared generator, seeded with a fixed value for reproducibility. */
export const rng = mulberry32(0xc0ffee);

/** Create an independent seeded generator (e.g. per endpoint). */
export const seeded = (seed: number): (() => number) => mulberry32(seed);

export const randFloat = (
    min: number,
    max: number,
    rand: () => number = rng
): number => min + rand() * (max - min);

export const randInt = (
    min: number,
    max: number,
    rand: () => number = rng
): number => Math.floor(randFloat(min, max + 1, rand));

export const pick = <T>(items: readonly T[], rand: () => number = rng): T =>
    items[Math.floor(rand() * items.length)];

export const round = (value: number, decimals = 1): number => {
    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
};

/** Deterministic 32-bit hash of a string, handy for stable per-key seeds. */
export const hashString = (input: string): number => {
    let hash = 0x811c9dc5;
    for (let i = 0; i < input.length; i += 1) {
        hash ^= input.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193);
    }
    return hash >>> 0;
};

/**
 * A short, anonymous "faker"-style id generator (lowercase hex), good enough to
 * stand in for entity ids, context ids, song ids, etc.
 */
export const hexId = (length = 12, rand: () => number = rng): string => {
    let out = "";
    while (out.length < length) {
        out += Math.floor(rand() * 16).toString(16);
    }
    return out.slice(0, length);
};

export const isoNow = (offsetMs = 0): string =>
    new Date(Date.now() + offsetMs).toISOString();
