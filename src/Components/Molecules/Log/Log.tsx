import React, { FC } from "react";
import { Card, CardContent, CardActions, Typography, Button } from "@material-ui/core";
// TODO
// import ClearLogButton from '../containers/ClearLogButton';
// import RadioInfoButton from '../containers/RadioInfoButton';
import gitinfoJson from "../../../gitinfo.json";
import packageJson from "../../../../package.json";

import "./Log.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../Reducers";
import { LogState, Logline } from "./logSlice";

export type Props = {
    loglines: Logline[];
};

const Log: FC<Props> = () => {
    const loglines = useSelector<RootState, LogState["lines"]>(
        (state: RootState) => state.loglinesNew.lines
    );
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
                <Button>clear</Button>
                {/*<ClearLogButton />
                <RadioInfoButton />*/}
            </CardActions>
        </Card>
    );
};

export default Log;
