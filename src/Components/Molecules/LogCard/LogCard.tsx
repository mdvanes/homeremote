import React, { FC } from "react";
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
} from "@material-ui/core";
import gitinfoJson from "../../../gitinfo.json";
import packageJson from "../../../../package.json";

import "./LogCard.scss";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../Reducers";
import { LogState, clearLog } from "./logSlice";

const Log: FC = () => {
    const dispatch = useDispatch();
    const loglines = useSelector<RootState, LogState["lines"]>(
        (state: RootState) => state.loglines.lines
    );
    const handleClearLog = (): void => {
        dispatch(clearLog());
    };
    return (
        <Card className="log-card">
            <CardContent className="log-card-text version">
                <Typography>
                    version: {gitinfoJson.hash}-{gitinfoJson.branch}-
                    {packageJson.version}
                </Typography>
            </CardContent>
            <CardContent className="log-card-text">
                {loglines &&
                    loglines.map((logline, index) => (
                        <div key={index}>{logline.message}</div>
                    ))}
            </CardContent>
            <CardActions className="log-card-actions">
                <Button onClick={handleClearLog}>clear</Button>
            </CardActions>
        </Card>
    );
};

export default Log;
