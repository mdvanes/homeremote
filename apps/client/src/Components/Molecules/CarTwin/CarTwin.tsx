import {
    FooArgs,
    FooResponse,
    useGetCarTwinMutation,
} from "../../../Services/carTwinApi";
import { FC, useEffect, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/dist/query";

const ListOfData: FC<{ data: FooResponse }> = ({ data }) => {
    const {
        result: {
            data: { odometer },
        },
        doors: {
            data: {
                carLocked,
                frontLeft,
                frontRight,
                hood,
                rearLeft,
                rearRight,
                tailGate,
            },
        },
        car: {
            data: {
                images: { exteriorDefaultUrl },
            },
        },
        statistics,
        diagnostics,
        energy: {
            data: {
                batteryChargeLevel,
                electricRange,
                estimatedChargingTime,
                chargingConnectionStatus,
                chargingSystemStatus,
            },
        },
    } = data;

    const rawMinutes = parseInt(estimatedChargingTime.value, 10);
    const hours = Math.floor(rawMinutes / 60);
    const days = Math.floor(hours / 24);
    const hours1 = hours - days * 24;
    const minutes = rawMinutes - hours1 * 60 - days * 24 * 60;

    return (
        <>
            <img alt="car exterior" src={exteriorDefaultUrl} width="300" />
            <ul>
                <li>
                    odometer: {parseInt(odometer.value, 10) * 10}{" "}
                    {odometer.unit}{" "}
                    <div>
                        NOTE: This number is multiplied by 10 as a correction,
                        and should be accurate to 10 km instead 1 km.
                    </div>
                </li>

                <li>carLocked: {carLocked.value}</li>
                <li>frontLeft: {frontLeft.value}</li>
                <li>frontRight: {frontRight.value}</li>
                <li>hood: {hood.value}</li>
                <li>rearLeft: {rearLeft.value}</li>
                <li>rearRight: {rearRight.value}</li>
                <li>tailGate: {tailGate.value}</li>

                <li>
                    tripMeter1 (Manual Trip):{" "}
                    {parseInt(statistics.data.tripMeter1.value, 10) * 100} km{" "}
                    <div>
                        NOTE: This number is multiplied by 100 as a correction,
                        and should be accurate to 100 km instead 1 km.
                    </div>
                </li>
                {/* <li>tripMeter2: {statistics.data.tripMeter2.value} km</li> */}
                <li>
                    averageSpeed: {statistics.data.averageSpeed.value} km/hr
                </li>

                <li>
                    engineHoursToService:{" "}
                    {diagnostics.data.engineHoursToService.value} hours
                </li>
                <li>kmToService: {diagnostics.data.kmToService.value} km</li>

                <li>batteryChargeLevel: {batteryChargeLevel.value}%</li>
                <li>
                    electricRange: {electricRange.value} {electricRange.unit}
                </li>
                <li>
                    estimatedChargingTime: {estimatedChargingTime.value}{" "}
                    {estimatedChargingTime.unit} / {days} day(s) {hours1}{" "}
                    hour(s) {minutes} minute(s)
                </li>
                <li>
                    chargingConnectionStatus: {chargingConnectionStatus.value}
                </li>
                <li>chargingSystemStatus: {chargingSystemStatus.value}</li>
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
    const [result, setResult] = useState<FooResponse | undefined>();

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
    }, []);

    return (
        <div>
            <h1>cartwin</h1>
            {/* {error && <div>error</div>}
            {data && JSON.stringify(data)} */}
            {/* {result && (
                <>
                    odometer: {result.result.data.odometer.value}{" "}
                    {result.result.data.odometer.unit}
                    f: {result}
                </>
            )} */}
            {result && <ListOfData data={result} />}
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
            extendedToken:
            <textarea
                name="extendedToken"
                value={extendedTokenVal}
                onChange={(event) => {
                    setExtendedTokenVal(event.target.value);
                }}
            ></textarea>
            <button
                onClick={async () => {
                    // setFormArg({
                    //     connectedToken: connectedTokenVal,
                    // });
                    try {
                        localStorage.setItem(
                            "connectedTokenVal",
                            connectedTokenVal
                        );
                        localStorage.setItem("energyTokenVal", energyTokenVal);
                        localStorage.setItem(
                            "extendedTokenVal",
                            extendedTokenVal
                        );
                        const result = await getCarTwin({
                            connectedToken: connectedTokenVal,
                            energyToken: energyTokenVal,
                            extendedToken: extendedTokenVal,
                        }).unwrap();
                        // console.log(result);
                        setResult(result);
                    } catch (err) {
                        console.log(err);
                    }
                }}
            >
                refresh
            </button>
        </div>
    );
};
