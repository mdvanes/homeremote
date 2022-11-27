import React, { FC } from "react";
import GasChart from "../../Molecules/GasChart/GasChart";
import SwitchBarList from "../../Molecules/SwitchBarList/SwitchBarList";

const HomeAutomation: FC = () => (
    <>
        <SwitchBarList />
        <GasChart />
    </>
);

export default HomeAutomation;
