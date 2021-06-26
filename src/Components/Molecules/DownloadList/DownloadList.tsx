import { FC, useCallback, useEffect, useState } from "react";
import { LinearProgress, List, Paper } from "@material-ui/core";
import { DownloadListState, getDownloadList } from "./downloadListSlice";
import { useAppDispatch } from "../../../store";
import { RootState } from "../../../Reducers";
import { useSelector } from "react-redux";
import DownloadListItem from "./DownloadListItem";
import { logError } from "../LogCard/logSlice";
import { useGetDownloadListQuery } from "../../../Services/downloadListApi";

const UPDATE_INTERVAL_MS = 30000;

const DownloadList: FC = () => {
    const dispatch = useAppDispatch();
    // const { isLoading, downloads } = useSelector<RootState, DownloadListState>(
    //     (state: RootState) => state.downloadList
    // );

    // TODO move to interval somehow?
    const { data, error, isLoading } = useGetDownloadListQuery();
    const [listItems, setListItems] = useState<JSX.Element[]>([]);

    const getNewState = useCallback(async () => {
        // const { data, error, isLoading } = useGetDownloadListQuery();
        // const resultAction = await dispatch(getDownloadList());
        // if (!getDownloadList.fulfilled.match(resultAction)) {
        //     dispatch(logError("GetDownloadList failed"));
        // }
        // if (error) {
        //     dispatch(logError("GetDownloadList failed"));
        // }
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            dispatch(logError("GetDownloadList failed"));
        }
    }, [dispatch, error]);

    useEffect(() => {
        if (data && data.status === "received" && data.downloads) {
            setListItems(
                data.downloads.map<JSX.Element>((item) => (
                    <DownloadListItem key={item.id} item={item} />
                ))
            );
        } else if (data && data.status === "error") {
            dispatch(logError("GetDownloadList failed"));
        }
    }, [dispatch, data]);

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

    // const listItems: JSX.Element[] = []; /*downloads
    //     ? downloads.map<JSX.Element>((item) => (
    //           <DownloadListItem key={item.id} item={item} />
    //       ))
    //     : []; */

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
