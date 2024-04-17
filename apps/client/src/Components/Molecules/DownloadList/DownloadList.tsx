import { List, Paper } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useGetDownloadListQuery } from "../../../Services/downloadListApi";
import { getErrorMessage } from "../../../Utils/getErrorMessage";
import { useAppDispatch } from "../../../store";
import CardExpandBar from "../CardExpandBar/CardExpandBar";
import ErrorRetry from "../ErrorRetry/ErrorRetry";
import LoadingDot from "../LoadingDot/LoadingDot";
import { logError } from "../LogCard/logSlice";
import DownloadListItem from "./DownloadListItem";

const UPDATE_INTERVAL_MS = 30000;

const DownloadList: FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSkippingBecauseError, setIsSkippingBecauseError] = useState(false);
    const dispatch = useAppDispatch();

    const { data, error, isLoading, isFetching, refetch } =
        useGetDownloadListQuery(undefined, {
            pollingInterval: isSkippingBecauseError
                ? undefined
                : UPDATE_INTERVAL_MS,
        });
    const [listItems, setListItems] = useState<JSX.Element[]>([]);

    useEffect(() => {
        if (error) {
            setIsSkippingBecauseError(true);
            dispatch(
                logError(`GetDownloadList failed: ${getErrorMessage(error)}`)
            );
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
                <ErrorRetry retry={() => refetch()}>
                    DL could not load
                </ErrorRetry>
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
