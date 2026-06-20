import {
    GetElectricExportsResponse,
    GetElectricResponse,
    GetGasTemperaturesResponse,
    GetTemperaturesResponse,
    GetWaterResponse,
} from "../../Services/generated/energyUsageApiWithRetry";
import { hashString, randFloat, round, seeded } from "./random";

type Range = "day" | "week" | "month";

// A single Home Assistant history "State". All energy endpoints share this shape.
type HistoryState = GetElectricResponse[number][number];

interface SensorSpec {
    name: string;
    deviceClass?: string;
    unit: string;
    /** Returns the sensor value for sample `i` of `total`, 0..1 phase. */
    value: (phase: number, i: number, rand: () => number) => number;
}

const sampleTimes = (range: Range): number[] => {
    const now = Date.now();
    if (range === "day") {
        // 25 hourly points (first is dropped by the charts via slice(1)).
        return Array.from({ length: 25 }, (_, i) => now - (24 - i) * 3_600_000);
    }
    const days = range === "week" ? 7 : 30;
    return Array.from(
        { length: days + 1 },
        (_, i) => now - (days - i) * 86_400_000
    );
};

const buildHistory = (
    sensors: SensorSpec[],
    range: Range
): HistoryState[][] => {
    const times = sampleTimes(range);
    return sensors.map((sensor) => {
        const rand = seeded(hashString(`${sensor.name}-${range}`));
        const entityId = `sensor.${sensor.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")}`;
        return times.map((t, i) => {
            const phase = i / (times.length - 1);
            const iso = new Date(t).toISOString();
            return {
                entity_id: entityId,
                state: `${sensor.value(phase, i, rand)}`,
                attributes: {
                    friendly_name: sensor.name,
                    device_class: sensor.deviceClass,
                    state_class: "measurement",
                    unit_of_measurement: sensor.unit,
                },
                last_changed: iso,
                last_reported: iso,
                last_updated: iso,
                context: {
                    id: `ctx${i}`,
                    parent_id: undefined,
                    user_id: undefined,
                },
            };
        });
    });
};

// Smooth daily curve peaking around mid-afternoon.
const dailyCurve = (phase: number): number =>
    Math.sin((phase - 0.2) * Math.PI * 2) * 0.5 + 0.5;

export const getElectric = (range: Range): GetElectricResponse =>
    buildHistory(
        [
            {
                name: "Energy Usage",
                unit: "kWh",
                value: (phase, _i, rand) =>
                    round(
                        0.2 + dailyCurve(phase) * 1.3 + randFloat(0, 0.2, rand),
                        2
                    ),
            },
            {
                name: "Solar Production",
                unit: "kWh",
                value: (phase, _i, rand) =>
                    round(
                        Math.max(
                            0,
                            dailyCurve(phase) * 2.2 + randFloat(-0.1, 0.1, rand)
                        ),
                        2
                    ),
            },
            {
                name: "Grid",
                unit: "kWh",
                value: (phase, _i, rand) =>
                    round(
                        0.15 +
                            (1 - dailyCurve(phase)) * 0.9 +
                            randFloat(0, 0.15, rand),
                        2
                    ),
            },
        ],
        range
    );

export const getWater = (range: Range): GetWaterResponse =>
    buildHistory(
        [
            {
                name: "Water Usage",
                unit: "l",
                value: (phase, _i, rand) => {
                    // Morning + evening spikes.
                    const spike =
                        Math.exp(-(((phase - 0.3) * 6) ** 2)) +
                        Math.exp(-(((phase - 0.85) * 6) ** 2));
                    return round(2 + spike * 25 + randFloat(0, 3, rand), 1);
                },
            },
        ],
        range
    );

export const getTemperatures = (range: Range): GetTemperaturesResponse => {
    const areas = ["Living Room", "Bedroom"];
    const sensors: SensorSpec[] = areas.flatMap((area) => [
        {
            name: `${area} Temperature`,
            deviceClass: "temperature",
            unit: "°C",
            value: (phase, _i, rand) =>
                round(
                    20 +
                        Math.sin(phase * Math.PI * 2) * 2 +
                        randFloat(-0.3, 0.3, rand),
                    1
                ),
        },
        {
            name: `${area} Humidity`,
            deviceClass: "humidity",
            unit: "%",
            value: (phase, _i, rand) =>
                round(
                    52 -
                        Math.sin(phase * Math.PI * 2) * 8 +
                        randFloat(-1, 1, rand),
                    0
                ),
        },
    ]);
    return buildHistory(sensors, range);
};

export const getGasTemperatures = (range: Range): GetGasTemperaturesResponse =>
    buildHistory(
        [
            {
                name: "Outside Temperature",
                deviceClass: "temperature",
                unit: "°C",
                value: (phase, _i, rand) =>
                    round(
                        8 +
                            Math.sin(phase * Math.PI * 2) * 5 +
                            randFloat(-0.5, 0.5, rand),
                        1
                    ),
            },
            {
                name: "Boiler Temperature",
                deviceClass: "temperature",
                unit: "°C",
                value: (phase, _i, rand) =>
                    round(
                        45 +
                            Math.sin(phase * Math.PI * 2) * 10 +
                            randFloat(-1, 1, rand),
                        1
                    ),
            },
            {
                name: "Gas Usage",
                deviceClass: "gas",
                unit: "m³",
                value: (phase, _i, rand) =>
                    round(
                        0.1 +
                            (1 - dailyCurve(phase)) * 0.4 +
                            randFloat(0, 0.1, rand),
                        2
                    ),
            },
        ],
        range
    );

const DAY_NAMES = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

export const getElectricExports = (): GetElectricExportsResponse => {
    // ~120 daily records spanning 2023-2024 so the grid + year compare populate.
    const start = new Date("2023-09-01T00:00:00.000Z").getTime();
    const records: GetElectricExportsResponse = [];
    for (let day = 0; day < 240; day += 1) {
        const date = new Date(start + day * 86_400_000);
        const rand = seeded(hashString(`export-${date.toISOString()}`));
        let dayUsage = 0;
        const entries = Array.from({ length: 24 }, (_, hour) => {
            const phase = hour / 23;
            const v1 = round(
                0.05 + (1 - dailyCurve(phase)) * 0.2 + randFloat(0, 0.05, rand),
                3
            );
            const v2 = round(
                0.05 + dailyCurve(phase) * 0.35 + randFloat(0, 0.05, rand),
                3
            );
            const v = round(v1 + v2, 3);
            dayUsage = round(dayUsage + v, 3);
            const hh = `${hour}`.padStart(2, "0");
            return {
                v1,
                v2,
                v,
                time: `${date.toISOString().slice(0, 10)} ${hh}:00`,
            };
        });
        records.push({
            exportName: `export-${date.toISOString().slice(0, 10)}.csv`,
            dateMillis: date.getTime(),
            date: date.toISOString().slice(0, 10),
            dayOfWeek: DAY_NAMES[date.getUTCDay()],
            dayUsage,
            entries,
        });
    }
    return records;
};
