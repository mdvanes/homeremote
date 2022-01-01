import { FC, useEffect, useState } from "react";
import { LinearProgress, List, Paper } from "@material-ui/core";
import { useAppDispatch } from "../../../store";
import DownloadListItem from "./DownloadListItem";
import { logError } from "../LogCard/logSlice";
import { useGetDownloadListQuery } from "../../../Services/downloadListApi";
import { Alert } from "@material-ui/lab";

const UPDATE_INTERVAL_MS = 3000;
const SLOW_UDPATE_MS = 1000; // if the response takes longer than 1000ms, it is considered slow and the full progress bar is shown

const DownloadList: FC = () => {
    const dispatch = useAppDispatch();

    const { data, error, isLoading, isFetching } = useGetDownloadListQuery(
        undefined,
        {
            pollingInterval: UPDATE_INTERVAL_MS,
        }
    );
    const [listItems, setListItems] = useState<JSX.Element[]>([]);
    const [isSlow, setIsSlow] = useState(false);

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
        let timer: ReturnType<typeof setTimeout> | null = null;
        if (isLoading || isFetching) {
            setIsSlow(false);
            timer = setTimeout(() => {
                setIsSlow(true);
            }, SLOW_UDPATE_MS);
        }
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [isLoading, isFetching]);

    const loadProgress =
        isLoading || isFetching ? (
            <LinearProgress
                variant="indeterminate"
                style={{ width: isSlow ? "auto" : 4 }}
            />
        ) : (
            <div style={{ height: 4 }}></div>
        );

    return (
        <List component={Paper}>
            {loadProgress}
            {error && (
                <Alert severity="error">
                    There is an error, data may be stale
                </Alert>
            )}
            {listItems}
        </List>
    );
};

export default DownloadList;
