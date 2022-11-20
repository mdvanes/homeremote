import { FC, useEffect, useState } from "react";
import { Alert, List, Paper } from "@mui/material";
import { useAppDispatch } from "../../../store";
import DownloadListItem from "./DownloadListItem";
import { logError } from "../LogCard/logSlice";
import { useGetDownloadListQuery } from "../../../Services/downloadListApi";
import CardExpandBar from "../CardExpandBar/CardExpandBar";
import LoadingDot from "../LoadingDot/LoadingDot";

const UPDATE_INTERVAL_MS = 30000;

const DownloadList: FC = () => {
    const [isOpen, setIsOpen] = useState(false);
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
            const downloads = isOpen
                ? data.downloads
                : data.downloads.filter((d) => d.simpleState !== "paused");
            setListItems(
                downloads.map<JSX.Element>((item) => (
                    <DownloadListItem key={item.id} item={item} />
                ))
            );
        } else if (data && data.status === "error") {
            dispatch(logError("GetDownloadList failed"));
        }
    }, [dispatch, data, isOpen]);

    return (
        <List component={Paper}>
            <LoadingDot isLoading={isLoading || isFetching} />
            {error && (
                <Alert severity="error">
                    There is an error, data may be stale
                </Alert>
            )}
            {listItems}
            <CardExpandBar
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                hint={`and ${
                    data && data.status === "received" && data.downloads
                        ? data.downloads.length - listItems.length
                        : 0
                } paused`}
            />
        </List>
    );
};

export default DownloadList;
