import { Stack } from "@mui/material";
import { FC } from "react";
import ClimateSensorsCard from "../../Molecules/ClimateSensorsCard/ClimateSensorsCard";
import SwitchesCard from "../../Molecules/SwitchesCard/SwitchesCard";

const HomeAutomation: FC = () => (
    <Stack gap={1}>
        <SwitchesCard />
        <ClimateSensorsCard />
    </Stack>
);

export default HomeAutomation;
