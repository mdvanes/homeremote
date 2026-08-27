import { BrowseItem } from "@homeremote/types";
import {
    Box,
    Card,
    CardActionArea,
    CardMedia,
    Typography,
} from "@mui/material";
import { FC } from "react";
import { useGetArtistInfoQuery } from "../../../Services/jukeboxApi";
import { sanitizeDescription } from "./sanitizeDescription";

interface JukeboxDirCardListProps {
    items: BrowseItem[];
    onSelect: (item: BrowseItem) => void;
    // Only set when this grid is the artist's top-level album list, so a
    // biography (if Subsonic has one) can be shown below the cards. Not set
    // for e.g. multi-disc sub-directories under an album.
    artistId?: string;
}

const CARD_WIDTH = 160;

/**
 * Horizontal, wrapping grid of cards for directory-level entries in the
 * Browse tab: albums under an artist, or sub-directories (e.g. multi-disc
 * folders) under an album. Each card shows the cover art and the
 * album/dir name.
 */
const JukeboxDirCardList: FC<JukeboxDirCardListProps> = ({
    items,
    onSelect,
    artistId,
}) => {
    const { data: artistInfo } = useGetArtistInfoQuery(artistId ?? "", {
        skip: !artistId,
    });
    const description =
        artistInfo?.status === "received" ? artistInfo.description : "";
    const parsedDescription = sanitizeDescription(description);

    return (
        <Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {items.map((item) => (
                    <Card
                        key={item.id}
                        sx={{
                            width: CARD_WIDTH,
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <CardActionArea
                            onClick={() => onSelect(item)}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "stretch",
                                height: "100%",
                            }}
                        >
                            <CardMedia
                                component="img"
                                height={CARD_WIDTH}
                                image={`${
                                    process.env.NX_PUBLIC_BASE_URL
                                }/api/jukebox/coverart/${
                                    item.id
                                }?type=album&hash=${encodeURIComponent(
                                    item.title ?? ""
                                )}`}
                                alt={item.title}
                            />
                            <Box sx={{ p: 1, flex: 1 }}>
                                <Typography
                                    variant="body2"
                                    title={item.title}
                                    sx={{
                                        display: "-webkit-box",
                                        WebkitBoxOrient: "vertical",
                                        WebkitLineClamp: 2,
                                        overflow: "hidden",
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {item.title}
                                </Typography>
                            </Box>
                        </CardActionArea>
                    </Card>
                ))}
            </Box>
            {parsedDescription && (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                >
                    {parsedDescription}
                </Typography>
            )}
        </Box>
    );
};

export default JukeboxDirCardList;
