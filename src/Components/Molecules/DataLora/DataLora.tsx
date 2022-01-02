import { Paper } from "@material-ui/core";
import { FC } from "react";
import Map from "./Map";
import useStyles from "./Map.styles";

const DataLora: FC = () => {
    const classes = useStyles();
    return (
        <Paper className={classes.card}>
            <Map />
        </Paper>
    );
};

export default DataLora;
