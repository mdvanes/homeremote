import { MusicNote as MusicNoteIcon } from "@mui/icons-material";
import { Box, SxProps, Theme } from "@mui/material";
import { FC, useState } from "react";

interface CoverArtImageProps {
    src: string;
    alt: string;
    width: number | string;
    height: number | string;
    sx?: SxProps<Theme>;
}

/**
 * Cover art image with a Material UI music note placeholder shown on a
 * contrasting background whenever the source has no artwork (the server
 * responds with a 404 for e.g. a disc/folder without its own cover art) or
 * the image otherwise fails to load.
 */
const CoverArtImage: FC<CoverArtImageProps> = ({
    src,
    alt,
    width,
    height,
    sx,
}) => {
    const [hasError, setHasError] = useState(false);

    if (hasError) {
        return (
            <Box
                sx={{
                    width,
                    height,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "grey.800",
                    color: "grey.100",
                    ...sx,
                }}
            >
                <MusicNoteIcon
                    sx={{
                        fontSize:
                            typeof height === "number" ? height * 0.4 : "40%",
                    }}
                />
            </Box>
        );
    }

    return (
        <Box
            component="img"
            src={src}
            alt={alt}
            onError={() => setHasError(true)}
            sx={{ width, height, objectFit: "cover", ...sx }}
        />
    );
};

export default CoverArtImage;
