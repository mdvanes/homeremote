import { Card, CardContent } from "@mui/material";
import { FC } from "react";
import DockerStackList from "./DockerStackList";

export const DockerStackListCard: FC = () => {
    return (
        <Card sx={{ position: "relative" }}>
            <CardContent>
                <DockerStackList />
            </CardContent>
        </Card>
    );
};

export default DockerStackListCard;
