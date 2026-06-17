import { PreviouslyResponse } from "@homeremote/types";
import { getLatestStartMs } from "./getLatestStartMs";

const makeTrack = (start?: string): PreviouslyResponse =>
    ({
        artist: "Artist",
        title: "Title",
        name: "Programme",
        imageUrl: "",
        last_updated: "0",
        songImageUrl: "",
        broadcast: {},
        time: start ? { start } : {},
    }) as PreviouslyResponse;

describe("getLatestStartMs", () => {
    it("returns null for missing or empty data", () => {
        expect(getLatestStartMs(undefined)).toBeNull();
        expect(getLatestStartMs([])).toBeNull();
    });

    it("returns null when no track has a parseable start time", () => {
        expect(
            getLatestStartMs([makeTrack(), makeTrack("not-a-date")])
        ).toBeNull();
    });

    it("returns the newest start timestamp across tracks", () => {
        const older = "2024-01-01T10:00:00.000Z";
        const newer = "2024-01-01T10:05:00.000Z";
        const result = getLatestStartMs([makeTrack(older), makeTrack(newer)]);
        expect(result).toBe(Date.parse(newer));
    });

    it("detects a new song when the latest start increases", () => {
        const baseline = getLatestStartMs([
            makeTrack("2024-01-01T10:00:00.000Z"),
        ]);
        const afterNewSong = getLatestStartMs([
            makeTrack("2024-01-01T10:00:00.000Z"),
            makeTrack("2024-01-01T10:03:30.000Z"),
        ]);
        expect(afterNewSong).not.toBeNull();
        expect(baseline).not.toBeNull();
        expect((afterNewSong as number) > (baseline as number)).toBe(true);
    });
});
