import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { jukeboxApi } from "../../../Services/jukeboxApi";
import { useAppDispatch } from "../../../store";
import { PathEntry } from "./JukeboxFileBrowser";

export type BrowsePathResolution =
    | { status: "resolving"; entries: PathEntry[] }
    | { status: "resolved"; entries: PathEntry[] }
    | { status: "notFound"; entries: PathEntry[] };

const isPathEntryArray = (value: unknown): value is PathEntry[] =>
    Array.isArray(value) &&
    value.every(
        (entry) =>
            typeof entry?.id === "string" && typeof entry?.title === "string"
    );

// Does an already-resolved path (e.g. handed over via navigate(url, {state}))
// name the same directories, in the same order, as the URL's title segments?
const matchesSegments = (entries: PathEntry[], segments: string[]): boolean =>
    entries.length === segments.length &&
    entries.every((entry, index) => entry.title === segments[index]);

/**
 * Resolves a `/music/browse/<title>/<title>/...` URL's human-readable
 * segments to Subsonic ids, one level at a time: `browse()` (all artists) ->
 * match `segments[0]` by title -> id -> `browse(id)` -> match `segments[1]`
 * -> ... Every level is an RTK Query cache entry, so revisiting a path (e.g.
 * via back/forward) resolves from cache with no network request.
 *
 * In-app navigation already knows the ids (see `buildMusicBrowsePath`
 * call sites, which pass the resolved `PathEntry[]` as router state), so
 * this only needs to do the sequential-lookup dance on a cold load: a
 * pasted URL, a bookmark, or a hard refresh.
 */
export const useBrowsePathResolver = (
    segments: string[]
): BrowsePathResolution => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const segmentsKey = segments.join("/");
    const [resolution, setResolution] = useState<BrowsePathResolution>({
        status: segments.length === 0 ? "resolved" : "resolving",
        entries: [],
    });
    // Avoids setState after the effect's own segments have changed again -
    // a stale resolution from a superseded run must never overwrite a
    // newer one.
    const requestIdRef = useRef(0);

    useEffect(() => {
        const stateEntries = isPathEntryArray(location.state)
            ? location.state
            : undefined;
        if (stateEntries && matchesSegments(stateEntries, segments)) {
            setResolution({ status: "resolved", entries: stateEntries });
            return;
        }

        if (segments.length === 0) {
            setResolution({ status: "resolved", entries: [] });
            return;
        }

        const requestId = ++requestIdRef.current;
        setResolution({ status: "resolving", entries: [] });

        (async () => {
            const entries: PathEntry[] = [];
            let parentId: string | undefined;
            for (const segment of segments) {
                const result = await dispatch(
                    jukeboxApi.endpoints.getBrowse.initiate(parentId)
                ).unwrap();
                if (requestIdRef.current !== requestId) {
                    return;
                }
                if (result.status !== "received") {
                    setResolution({ status: "notFound", entries });
                    return;
                }
                // Duplicate sibling titles: the first match wins.
                const match = result.items.find(
                    (item) => item.title === segment
                );
                if (!match) {
                    setResolution({ status: "notFound", entries });
                    return;
                }
                entries.push({ id: match.id, title: match.title });
                parentId = match.id;
            }
            if (requestIdRef.current === requestId) {
                setResolution({ status: "resolved", entries });
            }
        })();
        // segmentsKey is the real dependency (a stable string); segments
        // itself is a new array every render.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, segmentsKey, location.state]);

    return resolution;
};
