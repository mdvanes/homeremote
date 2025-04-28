import { operations } from "./generated/energyUsage";

export interface GasUsageItem {
    /**
     * Counter in m3
     */
    c: string;
    /**
     * Day in yyyy-mm-dd format
     */
    d: string;
    /**
     * Usage in m3
     */
    v: string;
}

export interface GotGasUsageResponse {
    ValueQuantity: string;
    ValueUnits: string;
    counter: "1400.509";
    result: GasUsageItem[];
    status: string;
    title: string;
}

export interface TempItem {
    /**
     * humidity
     */
    hu: string;
    /**
     * Day in yyyy-mm-dd format
     */
    d: string;
    /**
     * Average temperature
     */
    ta: number;
    /**
     * Highest temperature
     */
    te: number;
    /**
     * Lowest temperature
     */
    tm: number;
}

export interface GotTempResponse {
    result: TempItem[];
    resultPrev: TempItem[];
    status: string;
    title: string;
}

interface EnergyUsageTempItem {
    avg: number;
    high: number;
    low: number;
}

export interface EnergyUsageGasItem {
    /**
     * Day in yyyy-mm-dd format
     */
    day: string;
    /**
     * Counter in m3
     */
    counter: string;
    /**
     * Usage in m3
     */
    used: string;
    /**
     * Temperatures
     */
    temp: Record<string, EnergyUsageTempItem>;
}

export interface EnergyUsageGetGasUsageResponse {
    ValueQuantity: string;
    ValueUnits: string;
    counter: "1400.509";
    result: EnergyUsageGasItem[];
    status: string;
    title: string;
}

export type EnergyUsageGetWaterResponse =
    operations["getWater"]["responses"]["200"]["content"]["application/json"];

export type EnergyUsageGetGasTemperatureQueryParams =
    operations["getGasTemperatures"]["parameters"]["query"];

export type EnergyUsageGetGasTemperatureResponse =
    operations["getGasTemperatures"]["responses"]["200"]["content"]["application/json"];

export type EnergyUsageGetTemperatureResponse =
    operations["getTemperatures"]["responses"]["200"]["content"]["application/json"];

export type EnergyUsageGetElectricExportsResponse =
    operations["getElectricExports"]["responses"]["200"]["content"]["application/json"];

export type EnergyUsageGetElectricResponse =
    operations["getElectric"]["responses"]["200"]["content"]["application/json"];
