import { Box, List, Paper } from "@mui/material";
import { FC, JSX, useEffect, useState } from "react";
import { useGetDownloadListQuery } from "../../../Services/downloadListApi";
import { usePolledQuery } from "../../../Utils/usePolledQuery";
import { useAppDispatch } from "../../../store";
import CardExpandBar from "../CardExpandBar/CardExpandBar";
import { staleContentSx } from "../CardStatus/CardStatus";
import CardStatusBar from "../CardStatusBar/CardStatusBar";
import { logError } from "../LogCard/logSlice";
import DownloadListItem from "./DownloadListItem";

const UPDATE_INTERVAL_MS = 30000;

const DownloadList: FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useAppDispatch();

    const {
        data,
        isLoading,
        isFetching,
        isError,
        isStale,
        lastUpdated,
        retry,
    } = usePolledQuery(useGetDownloadListQuery, undefined, {
        name: "Downloads",
        pollingInterval: UPDATE_INTERVAL_MS,
    });
    const [listItems, setListItems] = useState<JSX.Element[]>([]);

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
        <List component={Paper} sx={{ position: "relative" }}>
            <CardStatusBar
                isLoading={(isLoading || isFetching) && !isError}
                name="Downloads"
                isError={isError}
                isStale={isStale}
                retry={retry}
                lastUpdated={lastUpdated}
            />
            <Box sx={staleContentSx(isStale)}>
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
            </Box>
        </List>
    );
};

export default DownloadList;
