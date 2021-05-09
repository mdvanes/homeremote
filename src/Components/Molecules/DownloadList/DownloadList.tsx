import { FC, useEffect } from "react";
import {
    CircularProgress,
    Divider,
    IconButton,
    LinearProgress,
    List,
    ListItem,
    Paper,
    Typography,
} from "@material-ui/core";
import { PauseCircleFilled, PlayCircleFilled } from "@material-ui/icons";
import {
    DownloadListState,
    getDownloadList,
    pauseDownload,
} from "./downloadListSlice";
import { useAppDispatch } from "../../../store";
import { RootState } from "../../../Reducers";
import { useSelector } from "react-redux";

const DownloadList: FC = () => {
    const dispatch = useAppDispatch();
    const { isLoading, downloads } = useSelector<RootState, DownloadListState>(
        (state: RootState) => state.downloadList
    );

    useEffect(() => {
        (async () => {
            const resultAction = await dispatch(getDownloadList());
            if (getDownloadList.fulfilled.match(resultAction)) {
                // TODO simplify
                console.log("alles klar herr commissar");
            } else {
                // TODO snackbar
                console.error("something kaput");
            }
        })();
    }, [dispatch]);

    const handleClick = (id: number) => () => {
        dispatch(pauseDownload(id));
        // TODO handle response
    };

    const listItems = downloads.map(
        ({ id, name, status, size, percentage }) => (
            <>
                <ListItem key={`data-${id}`} divider>
                    <div>
                        <Typography variant="h6">{name}</Typography>
                        <Typography>
                            {id} down/up ▼0 kB/s ▲0 kB/s or "status" {status}
                        </Typography>
                        <Typography>
                            {size} ({percentage}%) - ETA
                        </Typography>
                    </div>
                    <IconButton color="secondary" onClick={handleClick(id)}>
                        {status === "Downloading" ? (
                            <PauseCircleFilled />
                        ) : (
                            <PlayCircleFilled />
                        )}
                    </IconButton>
                </ListItem>
                <LinearProgress
                    key={`progress-${id}`}
                    color={percentage === 100 ? "secondary" : "primary"}
                    variant="determinate"
                    value={percentage}
                />
            </>
        )
    );

    return (
        <List component={Paper}>
            {isLoading ? <LinearProgress /> : listItems}
            {/* <ListItem>
                <Typography>file 1</Typography>
                <IconButton color="primary">
                    <PlayCircleFilled />
                </IconButton>
                
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
               
            </ListItem>
            <LinearProgress
                color="secondary"
                variant="determinate"
                value={100}
            /> */}
        </List>
    );
};

export default DownloadList;
