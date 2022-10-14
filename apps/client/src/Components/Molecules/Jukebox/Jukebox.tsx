import {
    Card,
    CardContent,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import { useGetPlaylistsQuery } from "apps/client/src/Services/jukeboxApi";
import { FC } from "react";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";

interface IJukeboxProps {
    play: boolean;
}

const Jukebox: FC<IJukeboxProps> = ({ play }) => {
    const { data } = useGetPlaylistsQuery(undefined);

    if (data?.status !== "received") {
        return <></>;
    }

    return (
        <Card
            sx={
                {
                    // height: 250
                }
            }
        >
            <CardContent>
                {play ? "playing" : "stopped"}

                {/* <ul>
                    {data?.playlists &&
                        data.playlists.map(({ id, name }) => (
                            <li key={id}>{name}</li>
                        ))}
                </ul> */}

                <List>
                    {data.playlists.map(({ id, name }) => (
                        <ListItemButton key={id}>
                            <ListItemText>{name}</ListItemText>
                        </ListItemButton>
                    ))}
                </List>

                {/* <TreeView
                    aria-label="file system navigator"
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    sx={{
                        height: 240,
                        flexGrow: 1,
                        maxWidth: 400,
                        overflowY: "auto",
                    }}
                >
                    <TreeItem nodeId="1" label="Applications">
                        <TreeItem nodeId="2" label="Calendar" />
                    </TreeItem>
                    <TreeItem nodeId="5" label="Documents">
                        {data?.playlists &&
                            data.playlists.map(({ id, name }) => (
                                <TreeItem key={id} nodeId={id} label={name} />
                            ))}
                        
                    </TreeItem>
                </TreeView> */}
            </CardContent>
        </Card>
    );
};

export default Jukebox;
