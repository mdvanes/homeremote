import { components } from "./volvo/volvo.types";

// npx openapi-typescript libs/types/src/lib/volvo/connected-vehicle-c3-specification.json --output libs/types/src/lib/volvo/connected-vehicle-c3.schema.ts

type VolvoSdkError = "ERROR";

export interface CarTwinResponse {
    // result: {
    //     data: {
    //         odometer: {
    //             value?: string;
    //             unit?: string;
    //             timestamp?: string;
    //         };
    //     };
    // };
    connected: {
        odometer: components["schemas"]["Odometer"]["odometer"] | VolvoSdkError;
        doors: components["schemas"]["DoorAndLockStatus"] | VolvoSdkError;
        vehicleMetadata:
            | components["schemas"]["VehicleMetadata"]
            | VolvoSdkError;

        statistics: components["schemas"]["StatisticVals"] | VolvoSdkError;
        diagnostics: components["schemas"]["DiagnosticVals"] | VolvoSdkError;
        tyres: components["schemas"]["TyrePressure"] | VolvoSdkError;
    };
    // energy: {
    //     data: {
    //         batteryChargeLevel: {
    //             value: string;
    //             unit: string;
    //             timestamp: string;
    //         };
    //         electricRange: {
    //             value: string;
    //             unit: string;
    //             timestamp: string;
    //         };
    //         estimatedChargingTime: {
    //             value: string;
    //             unit: string;
    //             timestamp: string;
    //         };
    //         chargingConnectionStatus: {
    //             value: string;
    //             timestamp: string;
    //         };
    //         chargingSystemStatus: {
    //             value: string;
    //             timestamp: string;
    //         };
    //     };
    // };
}
