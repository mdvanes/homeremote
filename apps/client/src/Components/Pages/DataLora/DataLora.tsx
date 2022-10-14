import { FC } from "react";
import { Paper } from "@mui/material";
import Map from "../../Molecules/DataLora/Map";
import useStyles from "../../Molecules/DataLora/Map.styles";

const DataLoraPage: FC = () => {
    const { classes } = useStyles();
    return (
        <Paper className={classes.page}>
            <Map />
        </Paper>
    );
};

export default DataLoraPage;
