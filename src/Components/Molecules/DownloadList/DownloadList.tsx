import { FC } from "react";
import {
    Divider,
    IconButton,
    LinearProgress,
    List,
    ListItem,
    Paper,
    Typography,
} from "@material-ui/core";
import { PauseCircleFilled, PlayCircleFilled } from "@material-ui/icons";

const DownloadList: FC = () => (
    <List component={Paper}>
        <ListItem>
            <Typography>file 1</Typography>
            <IconButton color="primary">
                <PlayCircleFilled />
            </IconButton>
            {/* <IconButton color="secondary">
                <PauseCircleFilled />
            </IconButton> */}
            {/* <LinearProgress
                color="primary"
                variant="determinate"
                value={50}
                style={{
                    width: "100px",
                }}
            /> */}
        </ListItem>
        <Divider />
        <LinearProgress color="primary" variant="determinate" value={50} />
        <ListItem divider>
            <Typography>
                file 2 name / percentage / status / type / bytes
            </Typography>
            <IconButton color="secondary">
                <PauseCircleFilled />
            </IconButton>
            {/* <LinearProgress
                color="secondary"
                variant="determinate"
                value={100}
                style={{
                    width: "100px",
                }}
            /> */}
        </ListItem>
        <LinearProgress color="secondary" variant="determinate" value={100} />
    </List>
);

export default DownloadList;
