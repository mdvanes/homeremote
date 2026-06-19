import {
    LibraryMusic as LibraryMusicIcon,
    Radio as RadioIcon,
} from "@mui/icons-material";
import { Avatar, Popover } from "@mui/material";
import { FC, useState } from "react";
import { useHotKeyContext } from "../../Providers/HotKey/HotKeyProvider";

// A single piece of cover art for the currently active source, sized to nearly
// the full height of the bottom bar.
export const SOURCE_ART_SIZE = 64;

const SourceArt: FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const { currentSource, radioInfo, jukeboxInfo } = useHotKeyContext();
    const isRadio = currentSource === "radio";
    const info = isRadio ? radioInfo : jukeboxInfo;

    return (
        <>
            <Avatar
                variant="rounded"
                src={info.imageUrl}
                alt={isRadio ? "Radio" : "Jukebox"}
                sx={{
                    width: SOURCE_ART_SIZE,
                    height: SOURCE_ART_SIZE,
                    flexShrink: 0,
                }}
                onClick={(e) => setAnchorEl(e.currentTarget)}
            >
                {isRadio ? (
                    <RadioIcon fontSize="large" />
                ) : (
                    <LibraryMusicIcon fontSize="large" />
                )}
            </Avatar>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
                transformOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
                <img
                    src={info.imageUrl}
                    style={{ width: 600, display: "block" }}
                    alt=""
                />
            </Popover>
        </>
    );
};

export default SourceArt;
