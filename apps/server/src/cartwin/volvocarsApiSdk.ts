import { CarTwinResponse, components } from "@homeremote/types";
import got from "got";

const baseUrl = "https://api.volvocars.com";

export const volvocarsApiSdk = (
    vin: string,
    vccApiKey: string,
    connectedToken: string
) => {
    const headers = {
        "vcc-api-key": vccApiKey,
        authorization: `Bearer ${connectedToken}`,
        accept: "application/vnd.volvocars.api.connected-vehicle.vehicledata.v1+json",
    };

    const getOdometer = async (): Promise<
        CarTwinResponse["connected"]["odometer"]
    > => {
        try {
            const response: components["schemas"]["OdometerResponse"] =
                await got(
                    `${baseUrl}/connected-vehicle/v1/vehicles/${vin}/odometer`,
                    {
                        headers,
                    }
                ).json();
            return response.data.odometer;
        } catch {
            return "ERROR";
        }
    };

    const getStatistics = async (): Promise<
        CarTwinResponse["connected"]["statistics"]
    > => {
        try {
            const response: components["schemas"]["StatisticResponse"] =
                await got(
                    `${baseUrl}/connected-vehicle/v1/vehicles/${vin}/statistics`,
                    {
                        headers,
                    }
                ).json();
            return response.data;
        } catch {
            return "ERROR";
        }
        return {};
    };

    const getConnectedVehicle = async (): Promise<
        CarTwinResponse["connected"]
    > => {
        return {
            odometer: await getOdometer(),
            statistics: await getStatistics(),
        };
    };

    return {
        getConnectedVehicle,
        // connected: {
        //     // getOdometer,
        //     // getStatistics,

        // },
    };
};
