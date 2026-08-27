import { BrowseItem } from "@homeremote/types";
import {
    Box,
    Card,
    CardActionArea,
    CardMedia,
    Typography,
} from "@mui/material";
import { FC } from "react";

interface JukeboxDirCardListProps {
    items: BrowseItem[];
    onSelect: (item: BrowseItem) => void;
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
}) => {
    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {items.map((item) => (
                <Card key={item.id} sx={{ width: CARD_WIDTH }}>
                    <CardActionArea onClick={() => onSelect(item)}>
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
                        <Box sx={{ p: 1 }}>
                            <Typography
                                variant="body2"
                                noWrap
                                title={item.title}
                            >
                                {item.title}
                            </Typography>
                        </Box>
                    </CardActionArea>
                </Card>
            ))}
        </Box>
    );
};

export default JukeboxDirCardList;
