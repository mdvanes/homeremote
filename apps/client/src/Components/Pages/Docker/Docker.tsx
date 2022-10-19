import { FC } from "react";
// Sadly, there is no support for MUI5 in rescript-material-ui yet https://github.com/cca-io/rescript-material-ui/issues/182
// import { DockerListMod } from "@mdworld/homeremote-dockerlist";
import { Card, CardContent } from "@mui/material";
import { useDispatch } from "react-redux";
import DockerList from "../../Molecules/DockerList/DockerList";
import { logError } from "../../Molecules/LogCard/logSlice";

// const DockerList = DockerListMod.make;

const Docker: FC = () => {
    const dispatch = useDispatch();

    return (
        <Card>
            <CardContent>
                <DockerList
                    onError={(err: string) =>
                        dispatch(
                            logError(`Dockerlist failure: ${err.toString()}`)
                        )
                    }
                />
            </CardContent>
            {/* <DockerList
                    url={process.env.NX_BASE_URL || ""}
                    onError={(err: string) =>
                        dispatch(
                            logError(`Dockerlist failure: ${err.toString()}`)
                        )
                    }
                /> */}
        </Card>
    );
};

export default Docker;
