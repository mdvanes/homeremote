import { FC, useEffect } from "react";
import { LinearProgress, List, Paper } from "@material-ui/core";
import { DownloadListState, getDownloadList } from "./downloadListSlice";
import { useAppDispatch } from "../../../store";
import { RootState } from "../../../Reducers";
import { useSelector } from "react-redux";
import DownloadListItem from "./DownloadListItem";

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

    const listItems = downloads.map<JSX.Element>((item) => (
        <DownloadListItem key={item.id} item={item} />
    ));

    return (
        <List component={Paper}>
            {isLoading ? <LinearProgress /> : listItems}
        </List>
    );
};

export default DownloadList;
