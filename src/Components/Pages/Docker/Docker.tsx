import React, { FC } from "react";
import { DockerListMod } from "@mdworld/homeremote-dockerlist";
import { useDispatch } from "react-redux";
import { logError } from "../../Molecules/LogCard/logSlice";
import theme from "../../../theme";

const DockerList = DockerListMod.make;

const Docker: FC = () => {
    const dispatch = useDispatch();
    const style = {
        backgroundColor: theme.palette.primary.light,
        color: "white",
        // Workaround for Rescript opaque type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    return (
        <div style={{ fontFamily: "Roboto" }}>
            <DockerList
                url={process.env.REACT_APP_BASE_URL || ""}
                onError={(err: string) =>
                    dispatch(logError(`Dockerlist failure: ${err.toString()}`))
                }
                confirmButtonStyle={style}
            />
        </div>
    );
};

export default Docker;
