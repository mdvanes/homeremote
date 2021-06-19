import { FC } from "react";
import { DockerListMod } from "@mdworld/homeremote-dockerlist";
import { useDispatch } from "react-redux";
import { logError } from "../../Molecules/LogCard/logSlice";
import { Card } from "@material-ui/core";

const DockerList = DockerListMod.make;

const Docker: FC = () => {
    const dispatch = useDispatch();

    return (
        <Card>
            <DockerList
                url={process.env.REACT_APP_BASE_URL || ""}
                onError={(err: string) =>
                    dispatch(logError(`Dockerlist failure: ${err.toString()}`))
                }
            />
        </Card>
    );
};

export default Docker;
