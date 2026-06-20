import { CarTwinResponse } from "@homeremote/types";
import { http, HttpResponse } from "msw";
import { isoNow } from "../data/random";

const ERROR = "ERROR" as const;

// Only the fields the UI reads are populated; the rest report ERROR, which the
// CarTwin components render gracefully. Cast through unknown because the Volvo
// SDK schemas are deeply nested generated types.
const response: CarTwinResponse = {
    connected: {
        odometer: {
            value: "45210",
            unit: "kilometers",
            timestamp: isoNow(),
        } as unknown as CarTwinResponse["connected"]["odometer"],
        statistics: {
            averageSpeed: {
                value: "42",
                unit: "kmPerHour",
                timestamp: isoNow(),
            },
        } as unknown as CarTwinResponse["connected"]["statistics"],
        vehicleMetadata: {
            vin: "DEMOVIN0000000000",
        } as unknown as CarTwinResponse["connected"]["vehicleMetadata"],
        doors: ERROR,
        diagnostics: ERROR,
        tyres: ERROR,
    },
    energy: {
        electricRange: { value: "310", unit: "kilometers" },
        estimatedChargingTime: { value: "0", unit: "minutes" },
        batteryChargeLevel: { value: "82", unit: "percentage" },
        chargingConnectionStatus: {
            value: "CONNECTION_STATUS_DISCONNECTED",
        },
        chargingSystemStatus: { value: "CHARGING_SYSTEM_IDLE" },
    } as unknown as CarTwinResponse["energy"],
};

export const carTwinHandlers = [
    http.get("*/api/cartwin", () => HttpResponse.json(response)),
];
