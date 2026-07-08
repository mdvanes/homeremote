import { Card, CardContent } from "@mui/material";
import { FC } from "react";
import ServicesPanel from "./ServicesPanel";

export const ServicesPanelCard: FC = () => (
    <Card sx={{ position: "relative" }}>
        <CardContent>
            <ServicesPanel />
        </CardContent>
    </Card>
);

export default ServicesPanelCard;
