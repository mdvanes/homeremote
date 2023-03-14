import { FooArgs, useGetCarTwinMutation } from "../../../Services/carTwinApi";
import { FC, useEffect, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { CarTwinResponse } from "@homeremote/types";
import {
    Speed as SpeedIcon,
    Lock as LockIcon,
    LockOpen as LockOpenIcon,
    Warning as WarningIcon,
    Info as InfoIcon,
    Cancel as CancelIcon,
    Link as LinkIcon,
} from "@mui/icons-material";
import { InputAdornment, TextField, Tooltip } from "@mui/material";
import { Alert, Card, CardContent } from "@mui/material";

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

const hoursToDaysHours = (hoursString: string) => {
    const hours = parseInt(hoursString, 10);
    // const hours = Math.floor(rawMinutes / 60);
    const days = Math.floor(hours / 24);
    const hours1 = hours - days * 24;
    // const minutes = rawMinutes - hours1 * 60 - days * 24 * 60;
    return {
        days,
        hours: hours1,
    };
};

const ListOfData: FC<{ data: CarTwinResponse; authConnected: any }> = ({
    data,
    authConnected,
}) => {
    // const chargeTime = minutesToDaysHoursMinutes(estimatedChargingTime.value);
    // const toServiceTime = hoursToDaysHours(
    //     diagnostics.data.engineHoursToService.value
    // );

    const { odometer, doors, statistics, vehicleMetadata } = data.connected;

    return (
        <>
            {!vehicleMetadata || vehicleMetadata === "ERROR" ? (
                <Alert severity="warning" onClick={authConnected}>
                    Meta failed: authenticate connected vehicle
                </Alert>
            ) : (
                <img
                    alt="car exterior"
                    src={vehicleMetadata.images?.exteriorDefaultUrl ?? ""}
                    width="300"
                />
            )}
            <ul>
                <li>
                    {!odometer || odometer === "ERROR" ? (
                        "Odometer failed: authenticate connected vehicle"
                    ) : (
                        <>
                            <SpeedIcon /> odometer:{" "}
                            {parseInt(odometer.value ?? "", 10) * 10}{" "}
                            {odometer.unit === "kilometers"
                                ? "km"
                                : odometer.unit}{" "}
                            <Tooltip
                                title="NOTE: This number is multiplied by 10 as a
                                correction, and should be accurate to 10 km
                                instead 1 km."
                            >
                                <InfoIcon />
                            </Tooltip>
                        </>
                    )}
                </li>

                {!doors || doors === "ERROR" ? (
                    "Doors failed: authenticate connected vehicle"
                ) : (
                    <>
                        <li>
                            {<LockIcon />} carLocked: {doors.carLocked?.value}
                        </li>
                        {/* <li>frontLeft: {frontLeft.value}</li>
                        <li>frontRight: {frontRight.value}</li>
                        <li>hood: {hood.value}</li>
                        <li>rearLeft: {rearLeft.value}</li>
                        <li>rearRight: {rearRight.value}</li>
                        <li>tailGate: {tailGate.value}</li> */}
                    </>
                )}

                {!statistics || statistics === "ERROR" ? (
                    "Statistics failed: authenticate connected vehicle"
                ) : (
                    <>
                        <li>
                            tripMeter1 (Manual Trip):{" "}
                            {parseInt(statistics.tripMeter1?.value ?? "", 10) *
                                100}{" "}
                            km{" "}
                            <div>
                                NOTE: This number is multiplied by 100 as a
                                correction, and should be accurate to 100 km
                                instead 1 km.
                            </div>
                        </li>
                        {/* <li>tripMeter2: {statistics.data.tripMeter2.value} km</li> */}
                        <li>
                            averageSpeed: {statistics.averageSpeed?.value} km/hr
                        </li>
                    </>
                )}

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
            </ul>
        </>
    );
};

export const CarTwinCard: FC = () => {
    const [connectedTokenVal, setConnectedTokenVal] = useState("");
    const [energyTokenVal, setEnergyTokenVal] = useState("");
    const [extendedTokenVal, setExtendedTokenVal] = useState("");
    // TODO rename formArg
    // const [formArg, setFormArg] = useState<FooArgs | undefined>();
    // const args: FooArgs | typeof skipToken = formArg ? formArg : skipToken;
    // const { data, isLoading, isFetching, error } = useGetCarTwinQuery(args);
    const [getCarTwin] = useGetCarTwinMutation();
    const [result, setResult] = useState<CarTwinResponse | undefined>();
    const [showConnected, setShowConnected] = useState(false);
    // const [val, setVal] = useState<string>("");

    // if (isLoading || isFetching) {
    //     return <div>loading...</div>;
    // }

    useEffect(() => {
        const connectedTokenVal1 =
            localStorage.getItem("connectedTokenVal") ?? "";
        const energyTokenVal1 = localStorage.getItem("energyTokenVal") ?? "";
        const extendedTokenVal1 =
            localStorage.getItem("extendedTokenVal") ?? "";
        setConnectedTokenVal(connectedTokenVal1);
        setEnergyTokenVal(energyTokenVal1);
        setExtendedTokenVal(extendedTokenVal1);

        handleRefresh();
    }, []);

    const authConnected = () => {
        setShowConnected(true);
    };

    const handleRefresh = async () => {
        // setFormArg({
        //     connectedToken: connectedTokenVal,
        // });
        try {
            // localStorage.setItem("connectedTokenVal", connectedTokenVal);
            localStorage.setItem("energyTokenVal", energyTokenVal);
            // localStorage.setItem("extendedTokenVal", extendedTokenVal);
            const result = await getCarTwin({
                connectedToken: localStorage.getItem("connectedTokenVal") ?? "",
                energyToken: energyTokenVal,
                // extendedToken: extendedTokenVal,
            }).unwrap();
            if (result.connected.odometer) {
                setShowConnected(false);
            }
            // console.log(result);
            setResult(result);
        } catch (err) {
            console.log(err);
        }
    };

    const handleEnterSubmit = (ev: React.KeyboardEvent<HTMLDivElement>) => {
        if (ev.key === "Enter") {
            console.log(ev.key, connectedTokenVal);
            localStorage.setItem("connectedTokenVal", connectedTokenVal);
            handleRefresh();
        }
    };

    return (
        <div>
            <h1>cartwin</h1>
            {showConnected && (
                <>
                    <TextField
                        label="Connected Vehicle Token"
                        // fullWidth={true}
                        value={connectedTokenVal}
                        variant="standard"
                        onChange={(ev) => {
                            setConnectedTokenVal(ev.target.value);
                        }}
                        onKeyDown={handleEnterSubmit}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment
                                    position="end"
                                    onClick={() => {
                                        setConnectedTokenVal("");
                                    }}
                                >
                                    <CancelIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Tooltip title="open link to API in new tab">
                        <a href="https://developer.volvocars.com/apis/docs/test-access-tokens/">
                            <LinkIcon />
                        </a>
                    </Tooltip>
                </>
            )}
            {/* {error && <div>error</div>}
            {data && JSON.stringify(data)} */}
            {/* {result && (
                <>
                    odometer: {result.result.data.odometer.value}{" "}
                    {result.result.data.odometer.unit}
                    f: {result}
                </>
            )} */}
            {result && (
                <ListOfData data={result} authConnected={authConnected} />
            )}
            <hr />
            <pre>{result && JSON.stringify(result, null, 2)}</pre>
            <hr />
            connectedToken:
            <textarea
                name="connectedToken"
                value={connectedTokenVal}
                onChange={(event) => {
                    setConnectedTokenVal(event.target.value);
                }}
            ></textarea>
            energyToken:
            <textarea
                name="energyToken"
                value={energyTokenVal}
                onChange={(event) => {
                    setEnergyTokenVal(event.target.value);
                }}
            ></textarea>
            {/* extendedToken:
            <textarea
                name="extendedToken"
                value={extendedTokenVal}
                onChange={(event) => {
                    setExtendedTokenVal(event.target.value);
                }}
            ></textarea> */}
            <button onClick={handleRefresh}>refresh</button>
        </div>
    );
};
