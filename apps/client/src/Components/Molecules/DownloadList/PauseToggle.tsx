import { FC } from "react";
import { CircularProgress, IconButton } from "@mui/material";
import { PauseCircleFilled, PlayCircleFilled } from "@mui/icons-material";
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
        <IconButton color="secondary" onClick={handleClick(id)} size="large">
            {isResumed ? <PauseCircleFilled /> : <PlayCircleFilled />}
        </IconButton>
    );

    return isPausing || isResuming ? <CircularProgress /> : button;
};

export default PauseToggle;
