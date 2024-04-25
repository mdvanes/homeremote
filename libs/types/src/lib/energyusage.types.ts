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

export interface HomeAssistantEntry {
    entity_id: string;
    state: string;
    attributes: object;
    last_changed: string;
    last_updated: string;
}

export type HomeAssistantSensor = HomeAssistantEntry[];

export type EnergyUsageGetTemperatureResponse = HomeAssistantSensor[];

export type EnergyUsageGetWaterResponse = HomeAssistantSensor[];
