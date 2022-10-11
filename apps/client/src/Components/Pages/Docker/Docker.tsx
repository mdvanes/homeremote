import { FC } from "react";
import { DockerListMod } from "@mdworld/homeremote-dockerlist";
import { useDispatch } from "react-redux";
import { logError } from "../../Molecules/LogCard/logSlice";
import { Card } from "@mui/material";

const DockerList = DockerListMod.make;

const Docker: FC = () => {
    const dispatch = useDispatch();

    return (
        <Card>
            <DockerList
                url={process.env.NX_BASE_URL || ""}
                onError={(err: string) =>
                    dispatch(logError(`Dockerlist failure: ${err.toString()}`))
                }
            />
        </Card>
    );
};

export default Docker;
