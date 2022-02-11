import React, { FC } from "react";
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
} from "@material-ui/core";
import { Warning, InfoOutlined } from "@material-ui/icons";
import gitinfoJson from "../../../gitinfo.json";
import packageJson from "../../../../package.json";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../Reducers";
import { LogState, clearLog, Severity } from "./logSlice";
import useStyles from "./LogCard.styles";

const SeverityIcons = {
    [Severity.INFO]: (
        <InfoOutlined
            style={{
                fill: "grey",
            }}
        />
    ),
    [Severity.ERROR]: (
        <Warning
            style={{
                fill: "red",
            }}
        />
    ),
};

const Log: FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const loglines = useSelector<RootState, LogState["lines"]>(
        (state: RootState) => state.loglines.lines
    );
    const handleClearLog = (): void => {
        dispatch(clearLog());
    };
    return (
        <Card classes={{ root: `${classes.root} card-dashboard-height` }}>
            <CardContent className={classes.version}>
                <Typography variant="body2">
                    version: {gitinfoJson.hash}-{gitinfoJson.branch}-
                    {packageJson.version}
                </Typography>
            </CardContent>
            <CardContent classes={{ root: classes.content }}>
                {loglines &&
                    loglines
                        .slice()
                        .reverse()
                        .map((logline, index) => (
                            <Typography
                                key={index}
                                variant="body2"
                                classes={{ root: classes.message }}
                            >
                                {SeverityIcons[logline.severity]}
                                {logline.message}
                            </Typography>
                        ))}
            </CardContent>
            <CardActions>
                <Button onClick={handleClearLog}>clear</Button>
            </CardActions>
        </Card>
    );
};

export default Log;
