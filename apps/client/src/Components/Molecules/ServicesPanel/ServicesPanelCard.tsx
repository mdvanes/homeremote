import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { Card, CardContent, IconButton } from "@mui/material";
import { FC } from "react";
import { Link as RouterLink } from "react-router";
import ServicesPanel from "./ServicesPanel";

export const ServicesPanelCard: FC = () => (
    <Card sx={{ position: "relative" }}>
        <IconButton
            component={RouterLink}
            to="/services"
            size="small"
            aria-label="All details"
            title="All details"
            sx={{ position: "absolute", top: 4, right: 4, zIndex: 1 }}
        >
            <OpenInFullIcon fontSize="small" />
        </IconButton>
        <CardContent>
            <ServicesPanel />
        </CardContent>
    </Card>
);

export default ServicesPanelCard;
