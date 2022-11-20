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

// TODO fix types
// TODO reduce padding
const Nextup: FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
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
                        <ListItem

                        // style={{ flexDirection: "column" }}
                        >
                            {/* {item.seriesName} {item.seasonNr}x{item.epNr} {item.name} */}
                            {/* {JSON.stringify(item)} */}
                            <ListItemButton
                                onClick={() => setIsModalOpen(true)}
                            >
                                <ListItemAvatar>
                                    <Avatar
                                        alt="TODO"
                                        // TODO fix root path
                                        src={`http:///Items/${Id}/Images/Primary?fillHeight=180&fillWidth=320&quality=96&tag=${ImageTags.Primary}`}
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
            <Dialog open={isModalOpen} onClick={() => setIsModalOpen(false)}>
                <DialogTitle>Set backup account</DialogTitle>
                <img alt="TODO" src={`TODO`} />
            </Dialog>
        </>
    );
};

export default Nextup;
