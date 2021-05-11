import { FC, useCallback, useEffect } from "react";
import { LinearProgress, List, Paper } from "@material-ui/core";
import { DownloadListState, getDownloadList } from "./downloadListSlice";
import { useAppDispatch } from "../../../store";
import { RootState } from "../../../Reducers";
import { useSelector } from "react-redux";
import DownloadListItem from "./DownloadListItem";

const UPDATE_INTERVAL_MS = 30000;

const DownloadList: FC = () => {
    const dispatch = useAppDispatch();
    const { isLoading, downloads } = useSelector<RootState, DownloadListState>(
        (state: RootState) => state.downloadList
    );

    const getNewState = useCallback(async () => {
        const resultAction = await dispatch(getDownloadList());
        if (getDownloadList.fulfilled.match(resultAction)) {
            // TODO simplify
            console.log("alles klar herr commissar");
        } else {
            // TODO snackbar
            console.error("something kaput");
        }
    }, [dispatch]);

    useEffect(() => {
        getNewState();
        // Update with long-polling for now
        const timer = setInterval(() => {
            getNewState();
        }, UPDATE_INTERVAL_MS);
        return () => {
            clearInterval(timer);
        };
    }, [getNewState]);

    const listItems = downloads.map<JSX.Element>((item) => (
        <DownloadListItem key={item.id} item={item} />
    ));

    const loadProgress = isLoading ? (
        <LinearProgress variant="indeterminate" />
    ) : (
        <div style={{ height: 4 }}></div>
    );

    return (
        <List component={Paper}>
            {loadProgress}
            {listItems}
        </List>
    );
};

export default DownloadList;
