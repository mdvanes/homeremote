import { FooArgs, useGetCarTwinQuery } from "../../../Services/carTwinApi";
import { FC, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/dist/query";

export const CarTwinCard: FC = () => {
    const [connectedTokenVal, setConnectedTokenVal] = useState("");
    // TODO rename formArg
    const [formArg, setFormArg] = useState<FooArgs | undefined>();
    const args: FooArgs | typeof skipToken = formArg ? formArg : skipToken;
    const { data, isLoading, isFetching, error } = useGetCarTwinQuery(args);

    if (isLoading || isFetching) {
        return <div>loading...</div>;
    }

    return (
        <div>
            <h1>cartwin</h1>
            {error && <div>error</div>}
            {data && JSON.stringify(data)}
            connectedToken:
            <input
                name="connectedToken"
                value={connectedTokenVal}
                onChange={(event) => {
                    setConnectedTokenVal(event.target.value);
                }}
            />
            <button
                onClick={() => {
                    setFormArg({
                        connectedToken: connectedTokenVal,
                    });
                }}
            >
                refresh
            </button>
        </div>
    );
};
