import {
    FooArgs,
    FooResponse,
    useGetCarTwinMutation,
} from "../../../Services/carTwinApi";
import { FC, useState } from "react";
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
    } = data;
    return (
        <>
            <img alt="car exterior" src={exteriorDefaultUrl} width="300" />
            <ul>
                <li>
                    odometer: {odometer.value} {odometer.unit}
                </li>
                <li>carLocked: {carLocked.value}</li>
                <li>frontLeft: {frontLeft.value}</li>
                <li>frontRight: {frontRight.value}</li>
                <li>hood: {hood.value}</li>
                <li>rearLeft: {rearLeft.value}</li>
                <li>rearRight: {rearRight.value}</li>
                <li>tailGate: {tailGate.value}</li>
            </ul>
        </>
    );
};

export const CarTwinCard: FC = () => {
    const [connectedTokenVal, setConnectedTokenVal] = useState("");
    // TODO rename formArg
    // const [formArg, setFormArg] = useState<FooArgs | undefined>();
    // const args: FooArgs | typeof skipToken = formArg ? formArg : skipToken;
    // const { data, isLoading, isFetching, error } = useGetCarTwinQuery(args);
    const [getCarTwin] = useGetCarTwinMutation();
    const [result, setResult] = useState<FooResponse | undefined>();

    // if (isLoading || isFetching) {
    //     return <div>loading...</div>;
    // }

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
            <button
                onClick={async () => {
                    // setFormArg({
                    //     connectedToken: connectedTokenVal,
                    // });
                    try {
                        const result = await getCarTwin({
                            connectedToken: connectedTokenVal,
                        }).unwrap();
                        console.log(result);
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
