import { useGetWaterQuery } from "../../../Services/energyUsageApi";
import { FC, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { ClimateChart } from "./charts/ClimateChart";

export const Energy: FC = () => {
    const { data: waterData } = useGetWaterQuery(undefined);

    const [value, setValue] = useState("1");

    const handleTabChange = (
        _event: React.SyntheticEvent,
        newValue: string
    ) => {
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
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <ClimateChart />
                </TabPanel>
                <TabPanel value="2">Item Two</TabPanel>
                <TabPanel value="3">Item Three</TabPanel>
                <TabPanel value="4">
                    <div>
                        water:
                        {waterData &&
                            waterData.length &&
                            waterData.map((sensors) => (
                                <ul>
                                    {sensors.map((entry) => (
                                        <li>
                                            {entry.last_changed}{" "}
                                            {entry.entity_id} {entry.state}
                                        </li>
                                    ))}
                                </ul>
                            ))}
                    </div>
                </TabPanel>
            </TabContext>
        </Box>
    );
};

export default Energy;
