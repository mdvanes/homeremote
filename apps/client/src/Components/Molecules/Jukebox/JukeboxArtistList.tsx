import { BrowseItem } from "@homeremote/types";
import { Folder as FolderIcon } from "@mui/icons-material";
import {
    Box,
    Link,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import { FC, useMemo } from "react";

interface JukeboxArtistListProps {
    items: BrowseItem[];
    onSelectArtist: (item: BrowseItem) => void;
}

const getGroupLetter = (title: string): string => {
    const first = title.trim().charAt(0).toUpperCase();
    return first >= "A" && first <= "Z" ? first : "#";
};

const getGroupId = (letter: string): string => `jukebox-artist-group-${letter}`;

/**
 * Browse tab's root artist list: grouped alphabetically by first letter, with
 * a jump-to-letter index at the top. Each group is laid out in up to 3
 * columns depending on viewport width, filled vertically.
 */
const JukeboxArtistList: FC<JukeboxArtistListProps> = ({
    items,
    onSelectArtist,
}) => {
    const groups = useMemo(() => {
        const map = new Map<string, BrowseItem[]>();
        for (const item of items) {
            const letter = getGroupLetter(item.title);
            const existing = map.get(letter);
            if (existing) {
                existing.push(item);
            } else {
                map.set(letter, [item]);
            }
        }
        return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
    }, [items]);

    const handleJumpTo = (letter: string) => {
        document
            .getElementById(getGroupId(letter))
            ?.scrollIntoView({ behavior: "instant", block: "start" });
    };

    return (
        <Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                {groups.map(([letter]) => (
                    <Link
                        key={letter}
                        component="button"
                        underline="hover"
                        onClick={() => handleJumpTo(letter)}
                    >
                        {letter}
                    </Link>
                ))}
            </Box>
            {groups.map(([letter, groupItems]) => (
                <Box key={letter} id={getGroupId(letter)} sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                        {letter}
                    </Typography>
                    <List
                        sx={{
                            columns: { xs: 1, sm: 2, md: 3 },
                            columnGap: 2,
                        }}
                    >
                        {groupItems.map((item) => (
                            <ListItem
                                key={item.id}
                                disableGutters
                                disablePadding
                                sx={{ display: "block", breakInside: "avoid" }}
                            >
                                <ListItemButton
                                    onClick={() => onSelectArtist(item)}
                                >
                                    <ListItemIcon>
                                        <FolderIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={item.title} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            ))}
        </Box>
    );
};

export default JukeboxArtistList;
