import { CarTwinResponse } from "@homeremote/types";
import { Alert, Card, CardContent, Grid, List } from "@mui/material";
import { FC } from "react";
import { DoorsAndTyres } from "./DoorsAndTyres";
import { EnergyListItems } from "./EnergyListItems";
import { OdoListItem } from "./OdoListItem";
import { ServiceListItems } from "./ServiceListItems";
import { StatisticsListItems } from "./StatisticsListItems";

export const CarTwinCard: FC<{
    data: CarTwinResponse;
    handleAuthConnected: () => void;
    isLoading: boolean;
}> = ({ data, handleAuthConnected, isLoading }) => {
    const { odometer, doors, statistics, diagnostics, vehicleMetadata, tyres } =
        data.connected;

    const renderConnectedItems = () => {
        if (!odometer || odometer === "ERROR") {
            return (
                <Alert severity="warning" onClick={handleAuthConnected}>
                    Authenticate Connected Vehicle
                </Alert>
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
                        <img
                            alt="car exterior"
                            src={
                                vehicleMetadata.images?.exteriorDefaultUrl ?? ""
                            }
                            width="300"
                        />
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

    const renderEnergyItems = () => {
        if (!data.energy || data.energy === "ERROR") {
            return (
                <Alert
                    severity="warning"
                    onClick={handleAuthConnected}
                    sx={{ marginTop: 1 }}
                >
                    Authenticate Energy
                </Alert>
            );
        }

        return <EnergyListItems energy={data.energy} />;
    };

    return (
        <Card>
            <CardContent style={isLoading ? { filter: "blur(4px)" } : {}}>
                {renderConnectedItems()}
                {renderEnergyItems()}
            </CardContent>
        </Card>
    );
};
