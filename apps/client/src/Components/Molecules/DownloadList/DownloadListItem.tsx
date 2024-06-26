import { DownloadItem } from "@homeremote/types";
import { LinearProgress, ListItem, Typography } from "@mui/material";
import { FC } from "react";
import useStyles, { useListItemStyles } from "./DownloadListItem.styles";
import PauseToggle from "./PauseToggle";

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
    const { classes: listItemClasses } = useListItemStyles();
    const { classes } = useStyles();
    const isDownloading = simpleState === "downloading";
    return (
        <>
            <ListItem divider classes={listItemClasses}>
                <div className={classes.main}>
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
