import { FC, useEffect, useState } from "react";
import { LinearProgress, List, Paper } from "@material-ui/core";
import { useAppDispatch } from "../../../store";
import DownloadListItem from "./DownloadListItem";
import { logError } from "../LogCard/logSlice";
import { useGetDownloadListQuery } from "../../../Services/downloadListApi";

const UPDATE_INTERVAL_MS = 30000;

const DownloadList: FC = () => {
    const dispatch = useAppDispatch();

    const { data, error, isLoading, isFetching } = useGetDownloadListQuery(
        undefined,
        {
            pollingInterval: UPDATE_INTERVAL_MS,
        }
    );
    const [listItems, setListItems] = useState<JSX.Element[]>([]);

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

    const loadProgress =
        isLoading || isFetching ? (
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
