import { FC } from "react";
import { LinearProgress, ListItem, Typography } from "@material-ui/core";
import PauseToggle from "./PauseToggle";
import { DownloadItem } from "../../../ApiTypes/downloadlist.types";
import useStyles from "./DownloadListItem.styles";

interface Props {
    item: DownloadItem;
}

const DownloadListItem: FC<Props> = ({
    item: {
        id,
        name,
        simpleState,
        state,
        size,
        percentage,
        uploadSpeed,
        downloadSpeed,
        eta,
    },
}) => {
    const classes = useStyles();
    const isDownloading = simpleState === "downloading";
    return (
        <>
            <ListItem divider>
                <div>
                    <Typography className={classes.name}>{name}</Typography>
                    <Typography variant="body2">
                        {isDownloading
                            ? `${state} ▼${downloadSpeed}/s ▲${uploadSpeed}/s`
                            : state}
                    </Typography>
                    <Typography variant="body2">
                        {size} ({percentage}%)
                        {isDownloading && eta !== ""
                            ? ` | ${eta} remaining`
                            : ""}
                    </Typography>
                </div>
                <PauseToggle id={id} isResumed={isDownloading} />
            </ListItem>
            <LinearProgress
                color={percentage === 100 ? "secondary" : "primary"}
                variant="determinate"
                value={percentage}
            />
        </>
    );
};

export default DownloadListItem;
