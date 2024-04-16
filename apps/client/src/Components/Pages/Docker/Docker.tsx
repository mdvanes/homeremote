import { FC } from "react";
// Sadly, there is no support for MUI5 in rescript-material-ui yet https://github.com/cca-io/rescript-material-ui/issues/182
// import { DockerListMod } from "@mdworld/homeremote-dockerlist";
import { Card, CardContent } from "@mui/material";
import { useDispatch } from "react-redux";
import { useGetStacksQuery } from "../../../Services/stacksApi";
import DockerList from "../../Molecules/DockerList/DockerList";
import { logError } from "../../Molecules/LogCard/logSlice";

// const DockerList = DockerListMod.make;

const DockerStackList: FC = () => {
    const { data } = useGetStacksQuery(undefined);

    return (
        <div>
            docker stack list{" "}
            <ul>
                {(data ?? []).map((stack) => (
                    <li>{stack.Name}</li>
                ))}
            </ul>
        </div>
    );
};

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
                <DockerStackList />
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
