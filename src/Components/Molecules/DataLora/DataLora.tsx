import { Card, CardContent } from "@material-ui/core";
import { FC } from "react";
import Map from "./Map";

const DataLora: FC = () => {
    return (
        <Card style={{ marginTop: 10 }}>
            <CardContent>
                <Map />
            </CardContent>
        </Card>
    );
};

export default DataLora;
