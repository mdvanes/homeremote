import { Paper } from "@mui/material";
import { FC } from "react";
import Map from "../../Molecules/DataLora/Map";
import useStyles from "../../Molecules/DataLora/Map.styles";

const DataLoraPage: FC = () => {
    const { classes } = useStyles();
    return (
        <Paper className={classes.page}>
            <Map showChart />
        </Paper>
    );
};

export default DataLoraPage;
