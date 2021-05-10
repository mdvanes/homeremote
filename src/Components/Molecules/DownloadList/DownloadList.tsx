import { FC, useEffect, useState } from "react";
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

interface Props {
    id: number;
    isResumed: boolean;
}

const PauseToggle: FC<Props> = ({ isResumed, id }) => {
    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState(false);

    const handleClick = (id: number) => () => {
        setIsLoading(true);
        // TODO set loading icon on the button while waiting
        dispatch(pauseDownload(id));
        // TODO handle response
    };

    const button = (
        <IconButton color="secondary" onClick={handleClick(id)}>
            {isResumed ? <PauseCircleFilled /> : <PlayCircleFilled />}
        </IconButton>
    );

    return isLoading ? <CircularProgress /> : button;
};

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

    // const handleClick = (id: number) => () => {
    //     // TODO set loading icon on the button while waiting
    //     dispatch(pauseDownload(id));
    //     // TODO handle response
    // };

    const listItems = downloads.map(
        ({
            id,
            name,
            status,
            size,
            percentage,
            uploadSpeed,
            downloadSpeed,
            eta,
        }) => (
            <>
                <ListItem key={`data-${id}`} divider>
                    <div>
                        <Typography
                            style={{
                                fontWeight: "bold",
                                wordBreak: "break-word",
                            }}
                        >
                            [{id}] {name}
                        </Typography>
                        <Typography>
                            {status === "Downloading"
                                ? `down/up ▼${downloadSpeed} kB/s ▲${uploadSpeed} kB/s`
                                : status}
                        </Typography>
                        <Typography>
                            {size} ({percentage}%)
                            {status === "Downloading"
                                ? ` | ${eta} remaining`
                                : ""}
                        </Typography>
                    </div>
                    {/* <IconButton color="secondary" onClick={handleClick(id)}>
                        {status === "Downloading" ? (
                            <PauseCircleFilled />
                        ) : (
                            <PlayCircleFilled />
                        )}
                    </IconButton> */}
                    <PauseToggle id={id} isResumed={status === "Downloading"} />
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
