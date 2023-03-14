import { CarTwinResponse } from "@homeremote/types";
import {
    Info as InfoIcon,
    Lock as LockIcon,
    Speed as SpeedIcon,
    Tag as TagIcon,
    Filter1 as Filter1Icon,
    BatteryFull as BatteryFullIcon,
} from "@mui/icons-material";
import {
    Alert,
    Card,
    CardContent,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from "@mui/material";
import { FC } from "react";
import { DoorsAndTyres } from "./DoorsAndTyres";
import { EnergyListItems } from "./EnergyListItems";
import { OdoListItem } from "./OdoListItem";
import { ServiceListItems } from "./ServiceListItems";
import { StatisticsListItems } from "./StatisticsListItems";

export const CarTwinCard: FC<{
    data: CarTwinResponse;
    handleAuthConnected: () => void;
}> = ({ data, handleAuthConnected }) => {
    const { odometer, doors, statistics, diagnostics, vehicleMetadata, tyres } =
        data.connected;

    const renderConnectedItems = () => {
        if (!odometer || odometer === "ERROR") {
            return (
                <Alert severity="warning" onClick={handleAuthConnected}>
                    Authenticate Connected Vehicle
                </Alert>
            );
        }
        return (
            <>
                <Grid item>
                    {!vehicleMetadata || vehicleMetadata === "ERROR" ? (
                        <Alert severity="warning" onClick={handleAuthConnected}>
                            Meta failed: authenticate connected vehicle
                        </Alert>
                    ) : (
                        <img
                            alt="car exterior"
                            src={
                                vehicleMetadata.images?.exteriorDefaultUrl ?? ""
                            }
                            width="300"
                        />
                    )}
                </Grid>
                <Grid item alignItems="flex-end">
                    <DoorsAndTyres
                        doors={doors}
                        tyres={tyres}
                        handleAuthConnected={handleAuthConnected}
                    />
                    <List dense>
                        <ServiceListItems
                            diagnostics={diagnostics}
                            handleAuthConnected={handleAuthConnected}
                        />
                    </List>
                </Grid>
                <Grid item>
                    <List dense>
                        <OdoListItem
                            odometer={odometer}
                            handleAuthConnected={handleAuthConnected}
                        />

                        <StatisticsListItems
                            statistics={statistics}
                            handleAuthConnected={handleAuthConnected}
                        />
                    </List>

                    {/*<li>
    engineHoursToService: {toServiceTime.days} day(s){" "}
    {toServiceTime.hours} hour(s) [RAW:{" "}
    {diagnostics.data.engineHoursToService.value} hours]
</li>
<li>kmToService: {diagnostics.data.kmToService.value} km</li>

<li>batteryChargeLevel: {batteryChargeLevel.value}%</li>
<li>
    electricRange: {electricRange.value} {electricRange.unit}
</li>
<li>
    estimatedChargingTime: {chargeTime.days} day(s){" "}
    {chargeTime.hours} hour(s) {chargeTime.minutes} minute(s)
    [RAW: {estimatedChargingTime.value}{" "}
    {estimatedChargingTime.unit}]
</li>
<li>
    chargingConnectionStatus: {chargingConnectionStatus.value}
</li>
<li>chargingSystemStatus: {chargingSystemStatus.value}</li> */}
                </Grid>
            </>
        );
    };

    const renderEnergyItems = () => {
        if (!data.energy || data.energy === "ERROR") {
            return (
                <Alert severity="warning" onClick={handleAuthConnected}>
                    Authenticate Energy
                </Alert>
            );
        }

        return <EnergyListItems energy={data.energy} />;
    };

    return (
        <Card>
            <CardContent>
                <Grid container>{renderConnectedItems()}</Grid>
                {renderEnergyItems()}
            </CardContent>
        </Card>
    );
};
