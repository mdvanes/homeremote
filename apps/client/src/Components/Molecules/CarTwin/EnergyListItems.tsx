import { VolvoEnergySchemas } from "@homeremote/types";
import {
    Battery4Bar as Battery4BarIcon,
    Battery6Bar as Battery6BarIcon,
    BatteryChargingFull as BatteryChargingFullIcon,
    BatteryFull as BatteryFullIcon,
} from "@mui/icons-material";
import { Grid, Tooltip } from "@mui/material";
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

    const isCharging = false; // estimatedChargingTime?.value !== "0";

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
                <Tooltip title="Range">
                    <BatteryFullIcon />
                </Tooltip>
            </Grid>
            <Grid item>
                {electricRange?.value}{" "}
                {electricRange?.unit === "kilometers"
                    ? "km"
                    : electricRange?.unit}
            </Grid>
            {isCharging && (
                <>
                    <Grid item>
                        <Tooltip title="Estimated Charging Time">
                            {chargingIcon()}
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        {chargingLabel()}
                        chargingConnectionStatus:{" "}
                        {chargingConnectionStatus?.value}
                        chargingSystemStatus: {chargingSystemStatus?.value}
                    </Grid>
                </>
            )}
            {!isCharging && (
                <>
                    <Grid item>
                        <Tooltip title="Remaining Charge">
                            {chargeIcon()}
                        </Tooltip>
                    </Grid>
                    <Grid item>{batteryChargeLevel?.value}%</Grid>
                </>
            )}
        </Grid>
    );
};
