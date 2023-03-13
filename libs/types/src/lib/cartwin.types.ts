import { components } from "./volvo/volvo.types";

// npx openapi-typescript libs/types/src/lib/volvo/connected-vehicle-c3-specification.json --output libs/types/src/lib/volvo/connected-vehicle-c3.schema.ts

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
    odometer: components["schemas"]["Odometer"]["odometer"];
    // doors: {
    //     data: {
    //         carLocked: {
    //             value: string;
    //             timestamp: string;
    //         };
    //         frontLeft: {
    //             value: string;
    //             timestamp: string;
    //         };
    //         frontRight: {
    //             value: string;
    //             timestamp: string;
    //         };
    //         hood: {
    //             value: string;
    //             timestamp: string;
    //         };
    //         rearLeft: {
    //             value: string;
    //             timestamp: string;
    //         };
    //         rearRight: {
    //             value: string;
    //             timestamp: string;
    //         };
    //         tailGate: {
    //             value: string;
    //             timestamp: string;
    //         };
    //     };
    // };
    // car: {
    //     data: {
    //         images: {
    //             exteriorDefaultUrl: string;
    //         };
    //     };
    // };
    statistics: any;
    diagnostics: any;
    tyre: any;
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
