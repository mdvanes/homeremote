import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { FC, useEffect, useState } from "react";
import GasChart from "../../Molecules/GasChart/GasChart";
import { ClimateChart } from "./charts/ClimateChart";
import { ElectricChart } from "./charts/ElectricChart";
import { ElectricDataGrid } from "./charts/ElectricDataGrid";
import { WaterChart } from "./charts/WaterChart";

export const Energy: FC = () => {
    const [value, setValue] = useState("1");

    useEffect(() => {
        const params = new URL(document.location.href).searchParams;
        const tab = params.get("tab");
        if (tab) {
            setValue(tab);
        }
    }, []);

    const handleTabChange = (
        _event: React.SyntheticEvent,
        newValue: string
    ) => {
        const params = new URL(document.location.href).searchParams;
        params.set("tab", newValue);
        document.location.search = params.toString();
        setValue(newValue);
    };

    return (
        <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList
                        onChange={handleTabChange}
                        aria-label="lab API tabs example"
                    >
                        <Tab label="Climate" value="1" />
                        <Tab label="Gas" value="2" />
                        <Tab label="Electric" value="3" />
                        <Tab label="Water" value="4" />
                        <Tab label="Electric Exports" value="5" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <ClimateChart />
                </TabPanel>
                <TabPanel value="2">
                    <GasChart isBig />
                </TabPanel>
                <TabPanel value="3">
                    <ElectricChart />
                </TabPanel>
                <TabPanel value="4">
                    <WaterChart />
                </TabPanel>
                <TabPanel value="5">
                    <ElectricDataGrid />
                </TabPanel>
            </TabContext>
        </Box>
    );
};

export default Energy;
