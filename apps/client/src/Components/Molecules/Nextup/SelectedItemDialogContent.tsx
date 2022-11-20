import { useGetNextupQuery } from "../../../Services/nextupApi";
import { FC, useState } from "react";
import {
    Avatar,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Paper,
} from "@mui/material";
import { ShowNextUpItem } from "@homeremote/types";

export const SelectedItemDialogContent: FC<{ item?: ShowNextUpItem }> = ({
    item,
}) => {
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
            {/* <img
                alt={`Screenshot for ${Name}`}
                src={`${process.env.NX_BASE_URL}/api/nextup/thumbnail/${Id}?imageTagsPrimary=${ImageTags.Primary}&big=on`}
            /> */}
            <video
                preload="metadata"
                controls
                src={`${process.env.NX_BASE_URL}/api/nextup/video/${Id}`}
                width="100%"
            />
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
