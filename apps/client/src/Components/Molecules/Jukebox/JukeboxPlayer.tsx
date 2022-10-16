import { ISong, PlaylistArgs } from "@homeremote/types";
import { PlayArrow as PlayArrowIcon } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useGetPlaylistQuery } from "../../../Services/jukeboxApi";
import { FC, RefObject } from "react";

interface IJukeboxPlayerProps {
    audioElemRef: RefObject<HTMLAudioElement>;
    song: ISong;
    playlistId: string | undefined;
}

const JukeboxPlayer: FC<IJukeboxPlayerProps> = ({
    audioElemRef,
    song,
    playlistId,
}) => {
    const playlistArgs: PlaylistArgs | typeof skipToken = playlistId
        ? { id: playlistId }
        : skipToken;
    const { data: playlist } = useGetPlaylistQuery(playlistArgs);
    console.log("JukeboxPlayer: playlist=", playlist);
    const hash = song ? btoa(`${song.artist} - ${song.title}`) : "";

    // TODO on finished, play next in playlist on loop
    // if (playlist) {
    //     const index = playlist.findIndex((s) => s.id === song.id);
    //     const pl = playlist.slice(index);
    //     console.log(pl);
    // } else {
    //     console.log("no playlist");
    // }

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
                        // const index = playlist.findIndex(
                        //     (s) => s.id === song.id
                        // );
                        // const pl = playlist.slice(index);
                        // console.log(pl);

                        elem.play();
                    }
                }}
            />
        </div>
    );
};

export default JukeboxPlayer;
