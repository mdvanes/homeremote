import { CarTwinResponse } from "@homeremote/types";
import { Cancel as CancelIcon, Link as LinkIcon } from "@mui/icons-material";
import { Grid, InputAdornment, TextField, Tooltip } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useGetCarTwinMutation } from "../../../Services/carTwinApi";
import { CarTwinCard } from "./CarTwinCard";

export const CarTwinContainer: FC = () => {
    // TODO show loading state by setting opacity or blur
    const [connectedTokenVal, setConnectedTokenVal] = useState("");
    const [energyTokenVal, setEnergyTokenVal] = useState("");
    // const [extendedTokenVal, setExtendedTokenVal] = useState("");
    // TODO rename formArg
    // const [formArg, setFormArg] = useState<FooArgs | undefined>();
    // const args: FooArgs | typeof skipToken = formArg ? formArg : skipToken;
    const [getCarTwin] = useGetCarTwinMutation();
    const [result, setResult] = useState<CarTwinResponse | undefined>();
    const [showConnected, setShowConnected] = useState(false);

    // if (isLoading || isFetching) {
    //     return <div>loading...</div>;
    // }

    useEffect(() => {
        const connectedTokenVal1 =
            localStorage.getItem("connectedTokenVal") ?? "";
        const energyTokenVal1 = localStorage.getItem("energyTokenVal") ?? "";

        setConnectedTokenVal(connectedTokenVal1);
        setEnergyTokenVal(energyTokenVal1);

        handleRefresh();

        // TODO clear interval when unauthenticated
        const interval = setInterval(() => {
            handleRefresh();
        }, 30 * 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const authConnected = () => {
        setShowConnected(true);
    };

    const handleRefresh = async () => {
        try {
            const result = await getCarTwin({
                connectedToken: localStorage.getItem("connectedTokenVal") ?? "",
                energyToken: localStorage.getItem("energyTokenVal") ?? "",
            }).unwrap();
            if (result.connected.odometer) {
                setShowConnected(false);
            }
            setResult(result);
        } catch (err) {
            console.log(err);
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
            {showConnected && (
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
                    data={result}
                    handleAuthConnected={authConnected}
                />
            )}

            {/* TODO <pre>{result && JSON.stringify(result, null, 2)}</pre> */}
        </div>
    );
};
