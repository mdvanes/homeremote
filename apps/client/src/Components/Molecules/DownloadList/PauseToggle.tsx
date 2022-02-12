import { FC } from "react";
import { CircularProgress, IconButton } from "@material-ui/core";
import { PauseCircleFilled, PlayCircleFilled } from "@material-ui/icons";
import {
    usePauseDownloadMutation,
    useResumeDownloadMutation,
} from "../../../Services/downloadListApi";

interface Props {
    id: number;
    isResumed: boolean;
}

const PauseToggle: FC<Props> = ({ isResumed, id }) => {
    const [resumeDownload, { isLoading: isResuming }] =
        useResumeDownloadMutation();
    const [pauseDownload, { isLoading: isPausing }] =
        usePauseDownloadMutation();

    const handleClick = (id: number) => () => {
        if (isResumed) {
            pauseDownload({ id });
        } else {
            resumeDownload({ id });
        }
    };

    const button = (
        <IconButton color="secondary" onClick={handleClick(id)}>
            {isResumed ? <PauseCircleFilled /> : <PlayCircleFilled />}
        </IconButton>
    );

    return isPausing || isResuming ? <CircularProgress /> : button;
};

export default PauseToggle;