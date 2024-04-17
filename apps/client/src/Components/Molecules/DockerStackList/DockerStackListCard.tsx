import { Card, CardContent } from "@mui/material";
import DockerStackList from "./DockerStackList";
import { FC } from "react";

export const DockerStackListCard: FC = () => {
    return (
        <Card>
            <CardContent>
                <DockerStackList />
            </CardContent>
        </Card>
    );
};

export default DockerStackListCard;
