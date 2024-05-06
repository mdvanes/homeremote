import { components as ConnectedComponents } from "./external/volvo/connected-vehicle-c3.schema";
import { components as EnergyComponents } from "./external/volvo/energy-api.schema";

// npx openapi-typescript libs/types/src/lib/volvo/connected-vehicle-c3-specification.json --output libs/types/src/lib/volvo/connected-vehicle-c3.schema.ts
// npx openapi-typescript libs/types/src/lib/volvo/energy-api-specification.json --output libs/types/src/lib/volvo/energy-api.schema.ts

export type VolvoSdkError = "ERROR";
export type VolvoConnectedSchemas = ConnectedComponents["schemas"];
export type VolvoEnergySchemas = EnergyComponents["schemas"];

export interface CarTwinArgs {
    connectedToken: string;
    energyToken: string;
}

export interface CarTwinResponse {
    connected: {
        odometer: VolvoConnectedSchemas["Odometer"]["odometer"] | VolvoSdkError;
        doors: VolvoConnectedSchemas["DoorAndLockStatus"] | VolvoSdkError;
        vehicleMetadata:
            | VolvoConnectedSchemas["VehicleMetadata"]
            | VolvoSdkError;
        statistics: VolvoConnectedSchemas["StatisticVals"] | VolvoSdkError;
        diagnostics: VolvoConnectedSchemas["DiagnosticVals"] | VolvoSdkError;
        tyres: VolvoConnectedSchemas["TyrePressure"] | VolvoSdkError;
    };
    energy: VolvoEnergySchemas["RechargeStatus"] | VolvoSdkError;
}
