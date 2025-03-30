import { CarTwinResponse } from "@homeremote/types";
import { Speed as SpeedIcon } from "@mui/icons-material";
import { Alert, Tooltip } from "@mui/material";
import { FC } from "react";
import { StatisticsListItem } from "./StatisticsListItem";

export const StatisticsListItems: FC<{
    statistics: CarTwinResponse["connected"]["statistics"];
    // handleAuthConnected: () => void;
}> = ({
    statistics,
    // handleAuthConnected
}) => {
    const tripMeterInfo =
        "NOTE: This number is multiplied by 100 as a correction, and should be accurate to 100 km instead 1 km.";

    return (
        <>
            {!statistics || statistics === "ERROR" ? (
                <Alert
                    severity="warning"
                    // onClick={handleAuthConnected}
                >
                    Statistics failed: authenticate connected vehicle
                </Alert>
            ) : (
                <>
                    {/* <StatisticsListItem
                        icon={
                            <Tooltip title="Trip Meter 1 (Manual)">
                                <Filter1Icon />
                            </Tooltip>
                        }
                        primary={`${
                            parseInt(statistics.tripMeter1?.value ?? "", 10) *
                            100
                        } km`}
                        info={tripMeterInfo}
                    />
                    <StatisticsListItem
                        icon={
                            <Tooltip title="Trip Meter 2">
                                <Filter2Icon />
                            </Tooltip>
                        }
                        primary={`${
                            parseInt(statistics.tripMeter2?.value ?? "", 10) *
                            100
                        } km`}
                        info={tripMeterInfo}
                    /> */}
                    <StatisticsListItem
                        icon={
                            <Tooltip title="Average Speed">
                                <SpeedIcon />
                            </Tooltip>
                        }
                        primary={`${statistics.averageSpeed?.value} km/hr`}
                    />
                </>
            )}
        </>
    );
};
