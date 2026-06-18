import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useHotKeyContext } from "../../Providers/HotKey/HotKeyProvider";
import { CHANNELS } from "./channels";
import { useNowPlaying } from "./useNowPlaying";

/**
 * Headless radio engine: owns the hidden <audio> element and the now-playing
 * metadata for the selected channel, and registers itself with the global
 * hotkey provider so the unified player in the MusicBar can control it. It
 * renders no visible controls of its own.
 */
const RadioEngine: FC = () => {
    const {
        setRadioElem,
        setPlayRadio,
        setIsRadioPlaying,
        isRadioPlaying,
        setRadioInfo,
        radioChannelId,
    } = useHotKeyContext();

    const audioElemRef = useRef<HTMLAudioElement>(null);
    // Cache-busting timestamp appended to the stream URL so each (re)connect
    // attaches to the live edge instead of resuming a stale buffer.
    const [timestamp, setTimestamp] = useState(() => Date.now());
    const isRadioPlayingRef = useRef(isRadioPlaying);
    isRadioPlayingRef.current = isRadioPlaying;

    const channel =
        CHANNELS.find((c) => c.id === radioChannelId) ?? CHANNELS[0];
    const { nowPlaying, refetch } = useNowPlaying(radioChannelId);

    const play = useCallback(() => {
        setTimestamp(Date.now());
        // Wait for the audio element to pick up the refreshed src.
        window.setTimeout(() => {
            audioElemRef.current?.play();
        }, 50);
    }, []);

    // Register the audio element and play handler with the global hotkey provider.
    useEffect(() => {
        setRadioElem(audioElemRef);
    }, [setRadioElem]);

    useEffect(() => {
        setPlayRadio(() => play);
    }, [play, setPlayRadio]);

    // Expose the now-playing info to the unified player.
    useEffect(() => {
        setRadioInfo({
            title: nowPlaying?.title ?? "",
            artist: nowPlaying?.artist ?? "",
            album: nowPlaying?.name || channel.name,
            imageUrl: nowPlaying?.songImageUrl || nowPlaying?.imageUrl || "",
        });
    }, [nowPlaying, channel.name, setRadioInfo]);

    // When the channel changes, reconnect to the newly selected stream and keep
    // playback going if it was already playing.
    useEffect(() => {
        setTimestamp(Date.now());
        if (isRadioPlayingRef.current) {
            window.setTimeout(() => {
                audioElemRef.current?.play();
            }, 50);
        }
    }, [radioChannelId]);

    return (
        <audio
            ref={audioElemRef}
            src={`${channel.streamUrl}?${timestamp}`}
            onPlay={() => {
                setIsRadioPlaying(true);
                refetch();
            }}
            onPause={() => setIsRadioPlaying(false)}
            style={{ display: "none" }}
        >
            Your browser does not support the audio element.
        </audio>
    );
};

export default RadioEngine;
