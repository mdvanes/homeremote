import { ShowNextUpItem } from "@homeremote/types";
import { DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { FC, useState } from "react";
import { styled } from "@mui/material/styles";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const PreviewImg = styled(
    "div",
    {}
)(
    ({ theme }) => `
    cursor: pointer;
    position: relative;
    width: 100%;

    &::before {
        background-color: rgba(0, 0, 0, 0.5);
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
    }

    & img {
        width: 100%;
    }

    & svg {
        top: calc(50% - 125px);
        left: calc(50% - 125px);
        position: absolute;
        height: 250px;
        width: 250px;
    }
`
);

export const SelectedItemDialogContent: FC<{ item?: ShowNextUpItem }> = ({
    item,
}) => {
    const [isVideoVisible, setIsVideoVisible] = useState(false);
    if (!item) {
        return null;
    }
    const {
        SeriesName,
        ParentIndexNumber,
        Id,
        IndexNumber,
        Name,
        ProductionYear,
        CommunityRating,
        ImageTags,
    } = item;
    return (
        <>
            <DialogTitle>{Name}</DialogTitle>
            {!isVideoVisible && (
                <PreviewImg onClick={() => setIsVideoVisible(true)}>
                    <img
                        alt={`Screenshot for ${Name}`}
                        src={`${process.env.NX_BASE_URL}/api/nextup/thumbnail/${Id}?imageTagsPrimary=${ImageTags.Primary}&big=on`}
                        style={{
                            cursor: "pointer",
                        }}
                    />
                    <PlayArrowIcon />
                </PreviewImg>
            )}
            {isVideoVisible && (
                <video
                    autoPlay
                    controls
                    preload="metadata"
                    src={`${process.env.NX_BASE_URL}/api/nextup/video/${Id}`}
                    width="100%"
                />
            )}
            <DialogContent>
                <DialogContentText>
                    {ParentIndexNumber}x{IndexNumber}{" "}
                    <strong>{SeriesName} </strong>
                    {ProductionYear && ` (${ProductionYear}) `}
                </DialogContentText>
                {CommunityRating && (
                    <DialogContentText>
                        {CommunityRating.toFixed(1)}👍
                    </DialogContentText>
                )}
            </DialogContent>
        </>
    );
};
