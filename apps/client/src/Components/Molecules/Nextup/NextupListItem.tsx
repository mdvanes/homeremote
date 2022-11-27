import { ShowNextUpItem } from "@homeremote/types";
import {
    Avatar,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import { FC } from "react";

export const NextupListItem: FC<{
    item: ShowNextUpItem;
    setSelectedItem: (x: ShowNextUpItem) => void;
}> = ({ item, setSelectedItem }) => {
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
        <ListItem disableGutters disablePadding>
            <ListItemButton onClick={() => setSelectedItem(item)}>
                <ListItemAvatar>
                    <Avatar
                        alt={`Screenshot for ${Name}`}
                        src={`${process.env.NX_BASE_URL}/api/nextup/thumbnail/${Id}?imageTagsPrimary=${ImageTags.Primary}&big=off`}
                    />
                </ListItemAvatar>
                <ListItemText
                    primary={Name}
                    secondary={
                        <>
                            {ParentIndexNumber}x{IndexNumber}{" "}
                            <strong>{SeriesName} </strong>
                            {ProductionYear && ` (${ProductionYear}) `}
                        </>
                    }
                />
                <div>
                    {CommunityRating && ` ${CommunityRating.toFixed(1)}👍`}
                </div>
            </ListItemButton>
        </ListItem>
    );
};
