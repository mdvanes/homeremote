import { CarTwinResponse } from "@homeremote/types";
import { Alert, Grid, List } from "@mui/material";
import { FC } from "react";
import { DoorsAndTyres } from "./DoorsAndTyres";
import { EnergyListItems } from "./EnergyListItems";
import { OdoListItem } from "./OdoListItem";
import { ServiceListItems } from "./ServiceListItems";
import { StatisticsListItems } from "./StatisticsListItems";
import { ERROR } from "./constants";

export const CarTwinCardItems: FC<{
    data: CarTwinResponse;
    handleAuthConnected: () => void;
    isLoading: boolean;
}> = ({ data, handleAuthConnected, isLoading }) => {
    const { odometer, doors, statistics, diagnostics, vehicleMetadata, tyres } =
        data.connected;

    const hasConnectedError = !odometer || odometer === ERROR;
    const hasEnergyError = !data.energy || data.energy === ERROR;
    if (hasConnectedError || hasEnergyError) {
        return (
            <>
                {hasConnectedError && (
                    <Alert severity="warning" onClick={handleAuthConnected}>
                        Authenticate Connected Vehicle
                    </Alert>
                )}
                {hasEnergyError && (
                    <Alert
                        severity="warning"
                        onClick={handleAuthConnected}
                        sx={{ marginTop: 1 }}
                    >
                        Authenticate Energy
                    </Alert>
                )}
            </>
        );
    }

    return (
        <Grid container>
            <Grid item>
                {!vehicleMetadata || vehicleMetadata === "ERROR" ? (
                    <Alert severity="warning" onClick={handleAuthConnected}>
                        Meta failed: authenticate connected vehicle
                    </Alert>
                ) : (
                    <Grid container flexDirection="row">
                        <Grid item>
                            <img
                                alt="car exterior"
                                src={
                                    vehicleMetadata.images
                                        ?.exteriorDefaultUrl ?? ""
                                }
                                width="200"
                                style={{
                                    marginLeft: "-20px",
                                    marginTop: "-20px",
                                }}
                            />
                        </Grid>
                        {data.energy && data.energy !== ERROR && (
                            <Grid item>
                                <EnergyListItems energy={data.energy} />
                            </Grid>
                        )}
                    </Grid>
                )}
            </Grid>
            <Grid item alignItems="flex-end">
                <DoorsAndTyres
                    doors={doors}
                    tyres={tyres}
                    handleAuthConnected={handleAuthConnected}
                />
                <List dense>
                    <ServiceListItems
                        diagnostics={diagnostics}
                        handleAuthConnected={handleAuthConnected}
                    />
                </List>
            </Grid>
            <Grid item>
                <List dense>
                    <OdoListItem
                        odometer={odometer}
                        handleAuthConnected={handleAuthConnected}
                    />

                    <StatisticsListItems
                        statistics={statistics}
                        handleAuthConnected={handleAuthConnected}
                    />
                </List>
            </Grid>
        </Grid>
    );
};
