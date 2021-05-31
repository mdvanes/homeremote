import { FC } from "react";
import { DockerListMod, reactDomStyleT } from "@mdworld/homeremote-dockerlist";
import { useDispatch } from "react-redux";
import { logError } from "../../Molecules/LogCard/logSlice";
import theme from "../../../theme";
import { Card } from "@material-ui/core";

const DockerList = DockerListMod.make;

const Docker: FC = () => {
    const dispatch = useDispatch();
    const confirmButtonStyle: React.CSSProperties = {
        backgroundColor: theme.palette.primary.light,
        color: "white",
    };

    return (
        <Card>
            <DockerList
                url={process.env.REACT_APP_BASE_URL || ""}
                onError={(err: string) =>
                    dispatch(logError(`Dockerlist failure: ${err.toString()}`))
                }
                confirmButtonStyle={
                    // Workaround for Rescript opaque type
                    (confirmButtonStyle as unknown) as reactDomStyleT
                }
            />
        </Card>
    );
};

export default Docker;
