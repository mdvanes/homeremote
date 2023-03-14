import { CarTwinResponse, components } from "@homeremote/types";
import got from "got";

const baseUrl = "https://api.volvocars.com";

export const volvocarsApiSdk = (
    vin: string,
    vccApiKey: string,
    connectedToken: string
) => {
    const headers = (accept: string) => ({
        "vcc-api-key": vccApiKey,
        authorization: `Bearer ${connectedToken}`,
        // accept: "application/vnd.volvocars.api.connected-vehicle.vehicle.v1+json",
        accept,
    });

    const connectedUrl = `${baseUrl}/connected-vehicle/v1/vehicles/${vin}`;

    const gotConnected = async <T>(type: string): Promise<T> => {
        return got(`${connectedUrl}${type}`, {
            headers: headers(
                "application/vnd.volvocars.api.connected-vehicle.vehicledata.v1+json"
            ),
        }).json();
    };

    const gotVehicle = async <T>(type: string): Promise<T> => {
        return got(`${connectedUrl}${type}`, {
            headers: headers(
                "application/vnd.volvocars.api.connected-vehicle.vehicle.v1+json"
            ),
        }).json();
    };

    const getOdometer = async (): Promise<
        CarTwinResponse["connected"]["odometer"]
    > => {
        try {
            const response = await gotConnected<
                components["schemas"]["OdometerResponse"]
            >("/odometer");
            return response.data.odometer;
        } catch {
            return "ERROR";
        }
    };

    const getDoors = async (): Promise<
        CarTwinResponse["connected"]["doors"]
    > => {
        try {
            const response = await gotConnected<
                components["schemas"]["DoorStatusResponse"]
            >("/doors");
            return response.data;
        } catch {
            return "ERROR";
        }
    };

    const getStatistics = async (): Promise<
        CarTwinResponse["connected"]["statistics"]
    > => {
        try {
            const response = await gotConnected<
                components["schemas"]["StatisticResponse"]
            >("/statistics");
            return response.data;
        } catch {
            return "ERROR";
        }
    };

    const getVehicleMetadata = async (): Promise<
        CarTwinResponse["connected"]["vehicleMetadata"]
    > => {
        try {
            const response = await gotVehicle<
                components["schemas"]["VehicleDetailResponse"]
            >("");
            return response.data;
        } catch (err) {
            return "ERROR";
        }
    };

    const getDiagnostics = async (): Promise<
        CarTwinResponse["connected"]["diagnostics"]
    > => {
        try {
            const response = await gotConnected<
                components["schemas"]["DiagnosticResponse"]
            >("/diagnostics");
            return response.data;
        } catch {
            return "ERROR";
        }
    };

    const getTyres = async (): Promise<
        CarTwinResponse["connected"]["tyres"]
    > => {
        try {
            const response = await gotConnected<
                components["schemas"]["TyrePressureResponse"]
            >("/tyres");
            return response.data;
        } catch {
            return "ERROR";
        }
    };

    const getConnectedVehicle = async (): Promise<
        CarTwinResponse["connected"]
    > => {
        return {
            odometer: await getOdometer(),
            doors: await getDoors(),
            vehicleMetadata: await getVehicleMetadata(),
            statistics: await getStatistics(),
            diagnostics: await getDiagnostics(),
            tyres: await getTyres(),
        };
    };

    return {
        getConnectedVehicle,
    };
};
