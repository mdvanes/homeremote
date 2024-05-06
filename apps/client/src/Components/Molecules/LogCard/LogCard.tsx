import { InfoOutlined, Warning } from "@mui/icons-material";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Typography,
} from "@mui/material";
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
// eslint-disable-next-line @nx/enforce-module-boundaries
import packageJson from "../../../../../../package.json";
import { RootState } from "../../../Reducers";
import gitinfoJson from "../../../gitinfo.json";
import useStyles from "./LogCard.styles";
import { LogState, Severity, clearLog } from "./logSlice";

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
    const { classes } = useStyles();
    const dispatch = useDispatch();
    const loglines = useSelector<RootState, LogState["lines"]>(
        (state: RootState) => state.loglines.lines
    );
    const handleClearLog = (): void => {
        dispatch(clearLog());
    };
    const version =
        gitinfoJson.branch === packageJson.version
            ? `${gitinfoJson.hash}-${packageJson.version}`
            : `${gitinfoJson.hash}-${gitinfoJson.branch}-${packageJson.version}`;
    return (
        <Card classes={{ root: `${classes.root} card-dashboard-height` }}>
            <CardContent className={classes.version}>
                <Typography variant="body2">version: {version}</Typography>
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
