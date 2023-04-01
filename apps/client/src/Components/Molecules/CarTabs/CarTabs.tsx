import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { CarTwinCard } from "../CarTwin/CarTwinCard";
import DataLora from "../DataLora/DataLora";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            style={{ marginBottom: 20 }}
            {...other}
        >
            {value === index && children}
        </div>
    );
}

export const CarTabs = () => {
    const [activeTab, setActiveTab] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    return (
        <>
            <Tabs value={activeTab} onChange={handleChange}>
                <Tab label="tracker" />
                <Tab label="car twin" />
            </Tabs>
            <TabPanel value={activeTab} index={0}>
                <DataLora />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
                <CarTwinCard />
            </TabPanel>
        </>
    );
};
