import { CarTwinResponse } from "@homeremote/types";
import { FC, useEffect, useState } from "react";
import { useGetCarTwinMutation } from "../../../Services/carTwinApi";
import { useAppDispatch } from "../../../store";
import { logError } from "../LogCard/logSlice";
import { CarTwinCard } from "./CarTwinCard";
import { ERROR } from "./constants";
import { TokenForm } from "./TokenForm";

let updateInterval: ReturnType<typeof setInterval> | undefined = undefined;

const clearUpdateInterval = () => {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
};

export const CarTwinContainer: FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [connectedTokenVal, setConnectedTokenVal] = useState("");
    const [energyTokenVal, setEnergyTokenVal] = useState("");
    const [getCarTwin] = useGetCarTwinMutation();
    const [result, setResult] = useState<CarTwinResponse | undefined>();
    const [showTokenForm, setShowTokenForm] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const retrievedConnectedTokenVal =
            localStorage.getItem("connectedTokenVal") ?? "";
        const retrievedEnergyTokenVal =
            localStorage.getItem("energyTokenVal") ?? "";

        setConnectedTokenVal(retrievedConnectedTokenVal);
        setEnergyTokenVal(retrievedEnergyTokenVal);

        handleRefresh();

        updateInterval = setInterval(() => {
            handleRefresh();
        }, 60 * 1000);

        return () => {
            clearUpdateInterval();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const authConnected = () => {
        setShowTokenForm(true);
    };

    const handleRefresh = async () => {
        console.log("calling handleRefresh");
        try {
            setIsLoading(true);
            const result = await getCarTwin({
                connectedToken: localStorage.getItem("connectedTokenVal") ?? "",
                energyToken: localStorage.getItem("energyTokenVal") ?? "",
            }).unwrap();
            if (result.connected.odometer !== ERROR) {
                setShowTokenForm(false);
            }
            if (
                !result.connected.odometer ||
                result.connected.odometer === ERROR ||
                !result.energy ||
                result.energy === ERROR
            ) {
                console.log("clear", result);
                clearUpdateInterval();
            }
            setResult(result);
            setIsLoading(false);
        } catch (err) {
            dispatch(logError(err));
        }
    };

    const handleEnterSubmit = (ev: React.KeyboardEvent<HTMLDivElement>) => {
        if (ev.key === "Enter") {
            localStorage.setItem("connectedTokenVal", connectedTokenVal);
            localStorage.setItem("energyTokenVal", energyTokenVal);
            handleRefresh();
        }
    };

    return (
        <div>
            {showTokenForm && (
                <TokenForm
                    connectedTokenVal={connectedTokenVal}
                    setConnectedTokenVal={setConnectedTokenVal}
                    energyTokenVal={energyTokenVal}
                    setEnergyTokenVal={setEnergyTokenVal}
                    handleEnterSubmit={handleEnterSubmit}
                />
            )}
            {result && (
                <CarTwinCard
                    isLoading={isLoading}
                    data={result}
                    handleAuthConnected={authConnected}
                />
            )}
        </div>
    );
};
