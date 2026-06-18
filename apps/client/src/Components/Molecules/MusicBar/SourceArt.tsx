import {
    LibraryMusic as LibraryMusicIcon,
    Radio as RadioIcon,
} from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { FC } from "react";
import { useHotKeyContext } from "../../Providers/HotKey/HotKeyProvider";

// A single piece of cover art for the currently active source, sized to nearly
// the full height of the bottom bar.
export const SOURCE_ART_SIZE = 64;

const SourceArt: FC = () => {
    const { currentSource, radioInfo, jukeboxInfo } = useHotKeyContext();
    const isRadio = currentSource === "radio";
    const info = isRadio ? radioInfo : jukeboxInfo;

    return (
        <Avatar
            variant="rounded"
            src={info.imageUrl}
            alt={isRadio ? "Radio" : "Jukebox"}
            sx={{
                width: SOURCE_ART_SIZE,
                height: SOURCE_ART_SIZE,
                flexShrink: 0,
            }}
        >
            {isRadio ? (
                <RadioIcon fontSize="large" />
            ) : (
                <LibraryMusicIcon fontSize="large" />
            )}
        </Avatar>
    );
};

export default SourceArt;
