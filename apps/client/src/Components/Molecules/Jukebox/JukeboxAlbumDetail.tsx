import { BrowseItem } from "@homeremote/types";
import {
    Box,
    CardMedia,
    List,
    ListItemButton,
    ListItemText,
    Typography,
} from "@mui/material";
import { FC } from "react";
import { useGetAlbumInfoQuery } from "../../../Services/jukeboxApi";
import { formatPlaybackTime } from "../MusicBar/useJukeboxPlaybackTime";
import { sanitizeDescription } from "./sanitizeDescription";

const COVER_SIZE = 200;

interface JukeboxAlbumDetailProps {
    albumId: string;
    albumName: string;
    songs: BrowseItem[];
    onPlaySong: (item: BrowseItem) => void;
}

/**
 * Album-level view of the Browse tab: a sidebar with the album's cover art,
 * name, artist and (when Subsonic has it) description, next to the list of
 * songs in the album.
 */
const JukeboxAlbumDetail: FC<JukeboxAlbumDetailProps> = ({
    albumId,
    albumName,
    songs,
    onPlaySong,
}) => {
    const { data: albumInfo } = useGetAlbumInfoQuery(albumId);
    const artist = songs.find((song) => song.artist)?.artist;
    const description =
        albumInfo?.status === "received" ? albumInfo.description : "";
    const parsedDescription = sanitizeDescription(description);

    return (
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            <Box sx={{ width: 400, flexShrink: 0 }}>
                <CardMedia
                    component="img"
                    height={COVER_SIZE}
                    sx={{ width: COVER_SIZE, borderRadius: 1 }}
                    image={`${
                        process.env.NX_PUBLIC_BASE_URL
                    }/api/jukebox/coverart/${albumId}?type=album&hash=${encodeURIComponent(
                        albumName
                    )}`}
                    alt={albumName}
                />
                <Typography variant="h6" sx={{ mt: 1 }}>
                    {albumName}
                </Typography>
                {artist && (
                    <Typography variant="body2" color="text.secondary">
                        {artist}
                    </Typography>
                )}
                {parsedDescription && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 4 }}
                    >
                        {parsedDescription}
                    </Typography>
                )}
            </Box>
            <List sx={{ flex: 1, minWidth: 240 }}>
                {songs.map((song) => (
                    <ListItemButton
                        key={song.id}
                        onClick={() => onPlaySong(song)}
                    >
                        <ListItemText
                            primary={
                                song.track
                                    ? `${song.track}. ${song.title}`
                                    : song.title
                            }
                        />
                        <ListItemText
                            sx={{
                                flex: "0 0 auto",
                                textAlign: "right",
                                pl: 1,
                            }}
                            primary={formatPlaybackTime(song.duration || 0)}
                        />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );
};

export default JukeboxAlbumDetail;
