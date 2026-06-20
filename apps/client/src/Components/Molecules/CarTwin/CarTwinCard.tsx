import { Box, Card, CardContent } from "@mui/material";
import { FC } from "react";
import { useGetCarTwinQuery } from "../../../Services/carTwinApi";
import { usePolledQuery } from "../../../Utils/usePolledQuery";
import CardStatus, { staleContentSx } from "../CardStatus/CardStatus";
import { CarTwinCardItems } from "./CarTwinCardItems";
// import { logError } from "../LogCard/logSlice";
// import { CarTwinCardItems } from "./CarTwinCardItems";
// import { TokenForm } from "./TokenForm";
// import { ERROR } from "./constants";

// let updateInterval: ReturnType<typeof setInterval> | undefined = undefined;

// const clearUpdateInterval = () => {
//     if (updateInterval) {
//         clearInterval(updateInterval);
//     }
// };

export const CarTwinCard: FC = () => {
    // const [isLoading, setIsLoading] = useState(false);
    // const [connectedTokenVal, setConnectedTokenVal] = useState("");
    // const [energyTokenVal, setEnergyTokenVal] = useState("");
    // const [getCarTwin] = useGetCarTwinMutation();
    const {
        data: result,
        isLoading: isCarTwinLoading,
        isFetching,
        isError,
        isStale,
        lastUpdated,
        retry,
    } = usePolledQuery(useGetCarTwinQuery, undefined, {
        name: "Car",
        pollingInterval: 60 * 1000,
        queryOptions: { refetchOnMountOrArgChange: true },
    });
    const isLoading = isCarTwinLoading || isFetching;
    // const [result, setResult] = useState<CarTwinResponse | undefined>();
    // const [showTokenForm, setShowTokenForm] = useState(false);
    // const dispatch = useAppDispatch();

    // useEffect(() => {
    //     const retrievedConnectedTokenVal =
    //         localStorage.getItem("connectedTokenVal") ?? "";
    //     const retrievedEnergyTokenVal =
    //         localStorage.getItem("energyTokenVal") ?? "";

    //     setConnectedTokenVal(retrievedConnectedTokenVal);
    //     setEnergyTokenVal(retrievedEnergyTokenVal);

    //     handleRefresh();

    //     updateInterval = setInterval(() => {
    //         handleRefresh();
    //     }, 60 * 1000);

    //     return () => {
    //         clearUpdateInterval();
    //     };
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    // const authConnected = () => {
    //     setShowTokenForm(true);
    // };

    // const handleRefresh = async () => {
    //     try {
    //         setIsLoading(true);
    //         const result = await getCarTwin({
    //             connectedToken: localStorage.getItem("connectedTokenVal") ?? "",
    //             energyToken: localStorage.getItem("energyTokenVal") ?? "",
    //         }).unwrap();
    //         if (result.connected.odometer !== ERROR) {
    //             setShowTokenForm(false);
    //         }
    //         if (
    //             !result.connected.odometer ||
    //             result.connected.odometer === ERROR ||
    //             !result.energy ||
    //             result.energy === ERROR
    //         ) {
    //             clearUpdateInterval();
    //         }
    //         setResult(result);
    //         setIsLoading(false);
    //     } catch (err) {
    //         dispatch(logError(err));
    //     }
    // };

    // const handleEnterSubmit = (ev: React.KeyboardEvent<HTMLDivElement>) => {
    //     if (ev.key === "Enter") {
    //         localStorage.setItem("connectedTokenVal", connectedTokenVal);
    //         localStorage.setItem("energyTokenVal", energyTokenVal);
    //         handleRefresh();
    //     }
    // };

    return (
        <Card sx={{ marginBottom: 2 }}>
            <CardContent style={isLoading ? { filter: "blur(4px)" } : {}}>
                <CardStatus
                    name="Car"
                    isError={isError}
                    isStale={isStale}
                    retry={retry}
                    lastUpdated={lastUpdated}
                    noMargin
                />
                {/* {showTokenForm && (
                    <TokenForm
                        connectedTokenVal={connectedTokenVal}
                        setConnectedTokenVal={setConnectedTokenVal}
                        energyTokenVal={energyTokenVal}
                        setEnergyTokenVal={setEnergyTokenVal}
                        handleEnterSubmit={handleEnterSubmit}
                    />
                )} */}
                {result && (
                    <Box sx={staleContentSx(isStale)}>
                        <CarTwinCardItems
                            isLoading={isLoading}
                            data={result}
                            // handleAuthConnected={authConnected}
                        />
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};
