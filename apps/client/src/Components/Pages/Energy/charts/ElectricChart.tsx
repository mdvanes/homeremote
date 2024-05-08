import { FC } from "react";
import { useGetElectricExportsQuery } from "../../../../Services/generated/energyUsageApi";

export const ElectricChart: FC = () => {
    const { data } = useGetElectricExportsQuery();
    return <>ElectricChart {JSON.stringify(data, null, 2)}</>;
};
