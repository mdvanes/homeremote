import { CarTwinResponse } from "@homeremote/types";
import { Cancel as CancelIcon, Link as LinkIcon } from "@mui/icons-material";
import { Grid, InputAdornment, TextField, Tooltip } from "@mui/material";
import { useAppDispatch } from "../../../store";
import { FC, useEffect, useState } from "react";
import { useGetCarTwinMutation } from "../../../Services/carTwinApi";
import { logError } from "../LogCard/logSlice";
import { CarTwinCard } from "./CarTwinCard";
import { ERROR } from "./constants";

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

        // TODO clear interval when unauthenticated
        updateInterval = setInterval(() => {
            handleRefresh();
        }, 30 * 1000);

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
                <Grid container gap={2} alignItems="baseline">
                    <TextField
                        label="Connected Vehicle Token"
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
                    <TextField
                        label="Energy Token"
                        value={energyTokenVal}
                        variant="standard"
                        onChange={(ev) => {
                            setEnergyTokenVal(ev.target.value);
                        }}
                        onKeyDown={handleEnterSubmit}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment
                                    position="end"
                                    onClick={() => {
                                        setEnergyTokenVal("");
                                    }}
                                >
                                    <CancelIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Tooltip title="open link to API in new tab">
                        <a
                            style={{ color: "white" }}
                            href="https://developer.volvocars.com/apis/docs/test-access-tokens/"
                        >
                            <LinkIcon />
                        </a>
                    </Tooltip>
                </Grid>
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
