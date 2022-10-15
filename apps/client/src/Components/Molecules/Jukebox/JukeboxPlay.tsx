import { ISong } from "@homeremote/types";
import { PlayArrow as PlayArrowIcon } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import { FC, RefObject } from "react";

interface IJukeboxPlayerProps {
    audioElemRef: RefObject<HTMLAudioElement>;
    song: ISong;
}

const JukeboxPlayer: FC<IJukeboxPlayerProps> = ({ audioElemRef, song }) => {
    const hash = song ? btoa(`${song.artist} - ${song.title}`) : "";
    return (
        <div>
            <Typography>
                <IconButton
                    onClick={() => {
                        const elem = audioElemRef.current;
                        if (elem) {
                            elem.pause();
                        }
                    }}
                >
                    <PlayArrowIcon />
                </IconButton>
                {song.artist} - {song.title}
            </Typography>
            <audio
                ref={audioElemRef}
                controls
                src={`${process.env.NX_BASE_URL}/api/jukebox/song/${song.id}?hash=${hash}`}
                onEnded={() => {
                    console.log("song ended");
                    const elem = audioElemRef.current;
                    if (elem) {
                        elem.play();
                    }
                }}
            />
            {/* TODO on finished, play next in playlist on loop */}
        </div>
    );
};

export default JukeboxPlayer;
