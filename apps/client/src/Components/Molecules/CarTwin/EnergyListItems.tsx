import { VolvoEnergySchemas } from "@homeremote/types";
import {
    Battery4Bar as Battery4BarIcon,
    Battery6Bar as Battery6BarIcon,
    BatteryChargingFull as BatteryChargingFullIcon,
    BatteryFull as BatteryFullIcon,
} from "@mui/icons-material";
import {
    Grid,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from "@mui/material";
import { FC } from "react";

const minutesToDaysHoursMinutes = (minutesString: string) => {
    const rawMinutes = parseInt(minutesString, 10);
    const hours = Math.floor(rawMinutes / 60);
    const days = Math.floor(hours / 24);
    const hours1 = hours - days * 24;
    const minutes = rawMinutes - hours1 * 60 - days * 24 * 60;
    return {
        days,
        hours: hours1,
        minutes,
    };
};

export const EnergyListItems: FC<{
    energy: VolvoEnergySchemas["RechargeStatus"];
}> = ({ energy }) => {
    const {
        electricRange,
        estimatedChargingTime,
        batteryChargeLevel,
        chargingConnectionStatus,
        chargingSystemStatus,
    } = energy;

    const isCharging = estimatedChargingTime?.value !== "0";

    const chargingIcon = () => {
        if (
            chargingConnectionStatus?.value &&
            chargingConnectionStatus.value === "a"
        ) {
            return <BatteryChargingFullIcon />;
        }
        return <div />;
    };

    const chargeIcon = () => {
        if (!batteryChargeLevel?.value) {
            return <div />;
        }
        console.log(
            batteryChargeLevel.value,
            parseFloat(batteryChargeLevel.value)
        );
        const c = parseFloat(batteryChargeLevel.value);
        if (c >= 90) {
            return <BatteryFullIcon />;
        }
        if (c >= 70) {
            return <Battery6BarIcon />;
        }
        if (c >= 50) {
            return <Battery4BarIcon />;
        }
        return <div />;
    };

    const chargingLabel = () => {
        if (!estimatedChargingTime?.value) {
            return "";
        }
        const chargeTime = minutesToDaysHoursMinutes(
            estimatedChargingTime.value
        );
        return `estimatedChargingTime: ${chargeTime.days} day(s) ${chargeTime.hours} hour(s) {chargeTime.minutes} minute(s)`;
    };

    return (
        <Grid container>
            <Grid item>
                <ListItem>
                    <ListItemIcon>
                        <Tooltip title="Range">
                            <BatteryFullIcon />
                        </Tooltip>
                    </ListItemIcon>
                    <ListItemText
                        primary={`${electricRange?.value} ${electricRange?.unit}`}
                    />
                </ListItem>
            </Grid>
            {isCharging && (
                <Grid item>
                    <ListItem>
                        <ListItemIcon>
                            <Tooltip title="Estimated Charging Time">
                                {chargingIcon()}
                            </Tooltip>
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <>
                                    {chargingLabel()}
                                    chargingConnectionStatus:{" "}
                                    {chargingConnectionStatus?.value}
                                    chargingSystemStatus:{" "}
                                    {chargingSystemStatus?.value}
                                </>
                            }
                        />
                    </ListItem>
                </Grid>
            )}
            {!isCharging && (
                <Grid item>
                    <ListItem>
                        <ListItemIcon>
                            <Tooltip title="Remaining Charge">
                                {chargeIcon()}
                            </Tooltip>
                        </ListItemIcon>
                        <ListItemText
                            primary={`${batteryChargeLevel?.value}%`}
                        />
                    </ListItem>
                </Grid>
            )}
        </Grid>
    );
};
