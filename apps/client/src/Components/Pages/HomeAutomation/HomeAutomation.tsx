import { Stack } from "@mui/material";
import { FC } from "react";
import { ClimateSensorsCard } from "../../Molecules/ClimateSensorsCard/ClimateSensorsCard";
import GasChart from "../../Molecules/GasChart/GasChart";
import SwitchBarList from "../../Molecules/SwitchBarList/SwitchBarList";
import { SwitchesCard } from "../../Molecules/SwitchesCard/SwitchesCard";

const HomeAutomation: FC = () => (
    <>
        <Stack gap={1}>
            <SwitchesCard />
            <ClimateSensorsCard />
        </Stack>
        <SwitchBarList />
        <GasChart isBig />
    </>
);

export default HomeAutomation;
