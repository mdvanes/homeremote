import { ISong } from "@homeremote/types";
import {
    Box,
    Breadcrumbs,
    CircularProgress,
    Link,
    List,
    ListItemButton,
    ListItemText,
    Typography,
} from "@mui/material";
import { FC } from "react";
import { useGetPlaylistQuery } from "../../../Services/jukeboxApi";
import { formatPlaybackTime } from "../MusicBar/useJukeboxPlaybackTime";
import CoverArtImage from "./CoverArtImage";
import { useUserPlaylists } from "./JukeboxPlaylists";
import { useStartJukeboxPlayback } from "./useStartJukeboxPlayback";

const COVER_SIZE = 200;

interface JukeboxPlaylistDetailProps {
    playlistName: string;
    onBack: () => void;
}

/**
 * Playlist-level view of the Playlists tab (`/music/playlists/<name>`): the
 * URL's name is resolved to a Subsonic playlist id via the playlists list
 * (duplicate names: the first match wins), then a sidebar with the cover
 * art and name is shown next to the playlist's songs. Clicking a song
 * starts playback of the playlist from that song.
 */
const JukeboxPlaylistDetail: FC<JukeboxPlaylistDetailProps> = ({
    playlistName,
    onBack,
}) => {
    const startPlayback = useStartJukeboxPlayback();
    const { playlists, isLoading, isError } = useUserPlaylists();
    const playlist = playlists?.find(({ name }) => name === playlistName);
    const { data, isLoading: isLoadingSongs } = useGetPlaylistQuery(
        { id: playlist?.id ?? "", type: "playlist" },
        { skip: !playlist }
    );
    const songs = data?.status === "received" ? data.songs : [];

    const handlePlaySong = (song: ISong) => {
        if (!playlist) {
            return;
        }
        startPlayback(
            { id: playlist.id, name: playlist.name, type: "playlist" },
            song
        );
    };

    return (
        <Box>
            <Breadcrumbs sx={{ mb: 1 }}>
                <Link component="button" underline="hover" onClick={onBack}>
                    Playlists
                </Link>
                <Link component="button" underline="none">
                    {playlistName}
                </Link>
            </Breadcrumbs>

            {(isLoading || isLoadingSongs) && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <CircularProgress size={24} />
                </Box>
            )}

            {!isLoading && (isError || (playlists && !playlist)) && (
                <Typography variant="body2" color="error">
                    That playlist could not be found.
                </Typography>
            )}

            {playlist && data?.status === "error" && (
                <Typography variant="body2" color="error">
                    Failed to load
                </Typography>
            )}

            {playlist && data?.status === "received" && (
                <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                    <Box sx={{ width: 400, flexShrink: 0 }}>
                        <CoverArtImage
                            width={COVER_SIZE}
                            height={COVER_SIZE}
                            sx={{ borderRadius: 1 }}
                            src={`${
                                process.env.NX_PUBLIC_BASE_URL
                            }/api/jukebox/coverart/${
                                playlist.id
                            }?type=playlist&hash=${encodeURIComponent(
                                playlist.name
                            )}`}
                            alt={playlist.name}
                        />
                        <Typography variant="h6" sx={{ mt: 1 }}>
                            {playlist.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {songs.length}{" "}
                            {songs.length === 1 ? "song" : "songs"}
                        </Typography>
                    </Box>
                    <List sx={{ flex: 1, minWidth: 240 }}>
                        {songs.length === 0 && (
                            <Typography variant="body2" color="text.secondary">
                                This playlist is empty
                            </Typography>
                        )}
                        {songs.map((song) => (
                            <ListItemButton
                                key={song.id}
                                onClick={() => handlePlaySong(song)}
                            >
                                <ListItemText
                                    primary={
                                        song.artist
                                            ? `${song.artist} – ${song.title}`
                                            : song.title
                                    }
                                />
                                <ListItemText
                                    sx={{
                                        flex: "0 0 auto",
                                        textAlign: "right",
                                        pl: 1,
                                    }}
                                    primary={formatPlaybackTime(
                                        song.duration || 0
                                    )}
                                />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
            )}
        </Box>
    );
};

export default JukeboxPlaylistDetail;
