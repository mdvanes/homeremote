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

const DownloadList: FC = () => {
    /* TODO
                
        Websocket in NestJS
        Websocket: when there is any connection, start polling the backend service, otherwise don't poll

        Use redux-observable
        Use https://www.npmjs.com/package/transmission or https://www.npmjs.com/package/@ctrl/transmission

        */
    return (
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
            <LinearProgress
                color="secondary"
                variant="determinate"
                value={100}
            />
        </List>
    );
    {
        /* <Card>
            <CardHeader>Files</CardHeader>
            <CardContent>
                <Typography>file 1</Typography>
                <IconButton color="primary">
                    <PlayCircleFilled />
                </IconButton>
                {/ <IconButton color="secondary">
                    <PauseCircleFilled />
                </IconButton> /}
                <LinearProgress
                    color="primary"
                    variant="determinate"
                    value={50}
                />
            </CardContent>
            <CardContent>
                <Typography>file 2</Typography>
                <IconButton color="secondary">
                    <PauseCircleFilled />
                </IconButton>
                <LinearProgress
                    color="secondary"
                    variant="determinate"
                    value={100}
                />
            </CardContent>
            <CardContent>file 3</CardContent>
        </Card> */
    }
};

export default DownloadList;
