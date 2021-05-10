import { FC, useState } from "react";
import { CircularProgress, IconButton } from "@material-ui/core";
import { PauseCircleFilled, PlayCircleFilled } from "@material-ui/icons";
import { pauseDownload, resumeDownload } from "./downloadListSlice";
import { useAppDispatch } from "../../../store";

interface Props {
    id: number;
    isResumed: boolean;
}

const PauseToggle: FC<Props> = ({ isResumed, id }) => {
    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState(false);

    const handleClick = (id: number) => () => {
        setIsLoading(true);
        const action = isResumed ? pauseDownload(id) : resumeDownload(id);
        // console.log(isResumed, action);
        dispatch(action);
        // TODO handle response
    };

    const button = (
        <IconButton color="secondary" onClick={handleClick(id)}>
            {isResumed ? <PauseCircleFilled /> : <PlayCircleFilled />}
        </IconButton>
    );

    return isLoading ? <CircularProgress /> : button;
};

export default PauseToggle;
