import {
    Pause as PauseIcon,
    PlayArrow as PlayArrowIcon,
    Radio as RadioIcon,
} from "@mui/icons-material";
import {
    Avatar,
    IconButton,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    Typography,
} from "@mui/material";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useHotKeyContext } from "../../Providers/HotKey/HotKeyProvider";
import {
    CHANNELS,
    getInitialChannelId,
    LAST_RADIO_CHANNEL,
    RadioChannelId,
} from "./channels";
import { useNowPlaying } from "./useNowPlaying";

const RadioPlayer: FC = () => {
    const {
        setRadioElem,
        setPlayRadio,
        setIsRadioPlaying,
        isRadioPlaying,
        setRadioImageUrl,
    } = useHotKeyContext();

    const audioElemRef = useRef<HTMLAudioElement>(null);
    const [channelId, setChannelId] =
        useState<RadioChannelId>(getInitialChannelId);
    // Cache-busting timestamp appended to the stream URL so each (re)connect
    // attaches to the live edge instead of resuming a stale buffer.
    const [timestamp, setTimestamp] = useState(() => Date.now());
    const isRadioPlayingRef = useRef(isRadioPlaying);
    isRadioPlayingRef.current = isRadioPlaying;

    const channel = CHANNELS.find((c) => c.id === channelId) ?? CHANNELS[0];
    const { nowPlaying, refetch } = useNowPlaying(channelId);

    const play = useCallback(() => {
        setTimestamp(Date.now());
        // Wait for the audio element to pick up the refreshed src.
        window.setTimeout(() => {
            audioElemRef.current?.play();
        }, 50);
    }, []);

    const pause = useCallback(() => {
        audioElemRef.current?.pause();
    }, []);

    // Register the audio element and play handler with the global hotkey provider.
    useEffect(() => {
        setRadioElem(audioElemRef);
    }, [setRadioElem]);

    useEffect(() => {
        setPlayRadio(() => play);
    }, [play, setPlayRadio]);

    // Expose the now-playing image to the bottom bar.
    useEffect(() => {
        if (nowPlaying) {
            setRadioImageUrl(
                nowPlaying.songImageUrl || nowPlaying.imageUrl || ""
            );
        }
    }, [nowPlaying, setRadioImageUrl]);

    const handleChannelChange = (event: SelectChangeEvent) => {
        const nextId = event.target.value as RadioChannelId;
        setChannelId(nextId);
        localStorage.setItem(LAST_RADIO_CHANNEL, nextId);
        // Reconnect to the newly selected channel, keeping playback going if it
        // was already playing.
        setTimestamp(Date.now());
        if (isRadioPlayingRef.current) {
            window.setTimeout(() => {
                audioElemRef.current?.play();
            }, 50);
        }
    };

    const title = nowPlaying?.title ?? "";
    const artist = nowPlaying?.artist ?? "";
    const imageUrl = nowPlaying?.songImageUrl || nowPlaying?.imageUrl || "";

    return (
        <Stack
            direction="row"
            spacing={1}
            sx={{ minWidth: 0, alignItems: "center" }}
        >
            <Avatar variant="rounded" src={imageUrl}>
                <RadioIcon />
            </Avatar>

            {isRadioPlaying ? (
                <IconButton
                    color="primary"
                    onClick={pause}
                    title="Pause radio (q)"
                    aria-label="Pause radio"
                >
                    <PauseIcon />
                </IconButton>
            ) : (
                <IconButton
                    onClick={play}
                    title="Play radio (q)"
                    aria-label="Play radio"
                >
                    <PlayArrowIcon />
                </IconButton>
            )}

            <Stack sx={{ minWidth: 0 }}>
                <Select
                    value={channelId}
                    onChange={handleChannelChange}
                    variant="standard"
                    size="small"
                    aria-label="Radio channel"
                >
                    {CHANNELS.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                            {c.name}
                        </MenuItem>
                    ))}
                </Select>
                <Typography variant="body2" noWrap title={`${title} ${artist}`}>
                    {title}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                    {artist}
                    {nowPlaying?.name ? ` · ${nowPlaying.name}` : ""}
                </Typography>
            </Stack>

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
        </Stack>
    );
};

export default RadioPlayer;
