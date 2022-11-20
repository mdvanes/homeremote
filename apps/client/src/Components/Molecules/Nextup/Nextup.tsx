import { useGetNextupQuery } from "../../../Services/nextupApi";
import { FC, useState } from "react";
import {
    Avatar,
    Dialog,
    DialogTitle,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Paper,
} from "@mui/material";
import { ShowNextUpItem } from "@homeremote/types";

const SelectedItemDialogContent: FC<{ item?: ShowNextUpItem }> = ({ item }) => {
    if (!item) {
        return null;
    }
    const { Name, Id, ImageTags } = item;
    return (
        <>
            <DialogTitle>{Name}</DialogTitle>
            <img
                alt="TODO"
                src={`${process.env.NX_BASE_URL}/api/nextup/thumbnail/${Id}?imageTagsPrimary=${ImageTags.Primary}`}
            />
        </>
    );
};

// TODO reduce padding
const Nextup: FC = () => {
    const [selectedItem, setSelectedItem] = useState<ShowNextUpItem>();
    // TODO poll
    const { data } = useGetNextupQuery(undefined);
    if (!data) {
        return null;
    }
    return (
        <>
            <List component={Paper}>
                {/* TODO collapsed 3, exanded max */}
                {data.items.slice(0, 8).map((item) => {
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
                        <ListItem>
                            <ListItemButton
                                onClick={() => setSelectedItem(item)}
                            >
                                <ListItemAvatar>
                                    <Avatar
                                        alt={`Screenshot for ${Name}`}
                                        src={`${process.env.NX_BASE_URL}/api/nextup/thumbnail/${Id}?imageTagsPrimary=${ImageTags.Primary}`}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={Name}
                                    secondary={
                                        <>
                                            {ParentIndexNumber}x{IndexNumber}{" "}
                                            <strong>{SeriesName} </strong>
                                            {ProductionYear &&
                                                ` (${ProductionYear}) `}
                                        </>
                                    }
                                />
                                <div>
                                    {CommunityRating &&
                                        ` ${CommunityRating.toFixed(1)}👍`}
                                </div>
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <Dialog
                open={Boolean(selectedItem)}
                onClick={() => setSelectedItem(undefined)}
            >
                <SelectedItemDialogContent item={selectedItem} />
            </Dialog>
        </>
    );
};

export default Nextup;
