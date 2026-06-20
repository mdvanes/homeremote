import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { logError, logInfo } from "../Components/Molecules/LogCard/logSlice";
import { useAppDispatch } from "../store";
import { getErrorMessage } from "./getErrorMessage";

/**
 * Options that {@link usePolledQuery} passes through to the wrapped RTK Query
 * hook. Kept structural (instead of importing RTK's option union) so any
 * generated query hook can be wrapped.
 */
export interface PollingQueryOptions {
    pollingInterval?: number;
    refetchOnReconnect?: boolean;
    refetchOnFocus?: boolean;
    refetchOnMountOrArgChange?: boolean | number;
    skip?: boolean;
}

/** Minimal shape of an RTK Query result that {@link usePolledQuery} relies on. */
export interface PollableQueryResult<Data> {
    data?: Data;
    error?: FetchBaseQueryError | SerializedError;
    isError: boolean;
    isFetching: boolean;
    isLoading: boolean;
    isSuccess: boolean;
    /**
     * Epoch ms of the last successful response. Retained by RTK Query across a
     * failed refetch, so while stale it reflects the age of the visible data.
     */
    fulfilledTimeStamp?: number;
    refetch: () => void;
}

type PollableQueryHook<Arg, Data> = (
    arg: Arg,
    options: PollingQueryOptions
) => PollableQueryResult<Data>;

export interface UsePolledQueryOptions {
    /** Human readable name used in log messages, e.g. "SwitchesCard". */
    name: string;
    /** Normal polling cadence in ms while the backend is healthy. */
    pollingInterval: number;
    /**
     * Upper bound for the backoff interval while the backend keeps failing.
     * Defaults to max(pollingInterval, 5 minutes). Polling never stops, so the
     * card keeps trying and heals itself once the backend recovers.
     */
    maxPollingInterval?: number;
    /**
     * Custom error sink. When provided it is called with the error message (and
     * the raw error) instead of dispatching a `logError`. Used by cards that
     * report through a parent (e.g. DockerList's `onError` prop) or that need to
     * inspect the error (e.g. HomeSec's 501 "feature disabled" case).
     */
    onError?: (
        errorMessage: string,
        error: FetchBaseQueryError | SerializedError
    ) => void;
    /**
     * Whether to log an info line when the backend recovers after a failure.
     * Defaults to `true` unless a custom `onError` sink is provided.
     */
    logRecovery?: boolean;
    /** Extra options passed straight through to the wrapped query hook. */
    queryOptions?: PollingQueryOptions;
}

export type UsePolledQueryResult<Data> = PollableQueryResult<Data> & {
    /** True when there is previously loaded data but the latest poll failed. */
    isStale: boolean;
    /** Epoch ms of the last successful response, or undefined if never loaded. */
    lastUpdated: number | undefined;
    /** Reset the backoff and refetch immediately. */
    retry: () => void;
};

// Cap the exponential backoff so the interval can grow at most this many
// doublings beyond the normal cadence.
const MAX_BACKOFF_STEPS = 4;
const DEFAULT_MAX_INTERVAL_MS = 5 * 60 * 1000;

/**
 * Wraps an RTK Query polling hook with consistent, self-healing error handling:
 *
 * - Keeps polling on failure (with a gentle exponential backoff) instead of
 *   stopping after the first error, so cards recover automatically once the
 *   backend comes back.
 * - Enables `refetchOnReconnect` and `refetchOnFocus`, so waking from sleep, a
 *   network hiccup, or refocusing the tab triggers an immediate refresh.
 * - Throttles logging: a single error line per failure streak (and again only
 *   if the error message changes), plus an optional recovery line, so the log
 *   isn't flooded while a service is down.
 * - Exposes `isStale` so the UI can keep showing the last known data while
 *   clearly marking it as stale, instead of hiding it.
 */
export function usePolledQuery<Arg, Data>(
    useQuery: PollableQueryHook<Arg, Data>,
    arg: Arg,
    {
        name,
        pollingInterval,
        maxPollingInterval,
        onError,
        logRecovery,
        queryOptions,
    }: UsePolledQueryOptions
): UsePolledQueryResult<Data> {
    const dispatch = useAppDispatch();
    const [failureCount, setFailureCount] = useState(0);

    const maxInterval =
        maxPollingInterval ??
        Math.max(pollingInterval, DEFAULT_MAX_INTERVAL_MS);

    const currentInterval =
        failureCount === 0
            ? pollingInterval
            : Math.min(
                  pollingInterval *
                      2 ** Math.min(failureCount, MAX_BACKOFF_STEPS),
                  maxInterval
              );

    const result = useQuery(arg, {
        refetchOnReconnect: true,
        refetchOnFocus: true,
        ...queryOptions,
        pollingInterval: currentInterval,
    });
    const { error, isError, isSuccess, refetch } = result;

    // Keep callbacks/config in refs so the effects only depend on query state
    // and don't re-run (or re-log) on unrelated re-renders.
    const onErrorRef = useRef(onError);
    const nameRef = useRef(name);
    const logRecoveryRef = useRef(logRecovery ?? !onError);
    useEffect(() => {
        onErrorRef.current = onError;
        nameRef.current = name;
        logRecoveryRef.current = logRecovery ?? !onError;
    }, [onError, name, logRecovery]);

    const inErrorStreakRef = useRef(false);
    const lastLoggedMessageRef = useRef<string | null>(null);

    useEffect(() => {
        if (isError && error) {
            const message = getErrorMessage(error);
            const isNewStreak = !inErrorStreakRef.current;
            if (isNewStreak || lastLoggedMessageRef.current !== message) {
                if (onErrorRef.current) {
                    onErrorRef.current(message, error);
                } else {
                    dispatch(logError(`${nameRef.current} failed: ${message}`));
                }
                lastLoggedMessageRef.current = message;
            }
            inErrorStreakRef.current = true;
            setFailureCount((count) => Math.min(count + 1, MAX_BACKOFF_STEPS));
        }
    }, [dispatch, error, isError]);

    useEffect(() => {
        if (isSuccess && inErrorStreakRef.current) {
            inErrorStreakRef.current = false;
            lastLoggedMessageRef.current = null;
            setFailureCount(0);
            if (logRecoveryRef.current) {
                dispatch(logInfo(`${nameRef.current} recovered`));
            }
        }
    }, [dispatch, isSuccess]);

    const retry = useCallback(() => {
        inErrorStreakRef.current = false;
        lastLoggedMessageRef.current = null;
        setFailureCount(0);
        refetch();
    }, [refetch]);

    return {
        ...result,
        isStale: isError && result.data !== undefined,
        lastUpdated: result.fulfilledTimeStamp,
        retry,
    };
}
