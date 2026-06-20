import { SmartEntitiesTypes } from "@homeremote/types";
import { hashString, randFloat, round, seeded } from "./random";

type State = SmartEntitiesTypes.State;

const entityId = (domain: string, name: string): string =>
    `${domain}.${name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`;

const SWITCH_NAMES = [
    "Living Room Lamp",
    "Kitchen Spots",
    "Hallway Light",
    "Desk Lamp",
    "Garden Lights",
    "Bedroom Light",
    "Coffee Machine",
    "TV Power",
];

const CLIMATE_AREAS = [
    "Living Room",
    "Kitchen",
    "Bedroom",
    "Bathroom",
    "Office",
    "Garage",
];

const makeContext = (id: string): State["context"] => ({
    id,
    parent_id: undefined,
    user_id: undefined,
});

const makeSwitch = (name: string, isOn: boolean): State => {
    const id = entityId("switch", name);
    return {
        entity_id: id,
        state: isOn ? "on" : "off",
        attributes: {
            friendly_name: name,
            icon: "mdi:lightbulb",
            supported_features: 0,
        },
        last_changed: new Date().toISOString(),
        last_reported: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        context: makeContext(`ctx${hashString(id).toString(16)}`),
    };
};

const makeClimateSensor = (
    area: string,
    kind: "temperature" | "humidity"
): State => {
    const rand = seeded(hashString(`${area}-${kind}`));
    const value =
        kind === "temperature"
            ? round(randFloat(17, 23, rand), 1)
            : round(randFloat(40, 65, rand), 0);
    const id = entityId("sensor", `${area} ${kind}`);
    return {
        entity_id: id,
        state: `${value}`,
        attributes: {
            friendly_name: `${area} ${
                kind === "temperature" ? "Temperature" : "Humidity"
            }`,
            device_class: kind,
            state_class: "measurement",
            unit_of_measurement: kind === "temperature" ? "°C" : "%",
        },
        last_changed: new Date().toISOString(),
        last_reported: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        context: makeContext(`ctx${hashString(id).toString(16)}`),
    };
};

// Mutable switch state so the update mutation can flip values in the demo.
const switchState = new Map<string, boolean>(
    SWITCH_NAMES.map((name, i) => [entityId("switch", name), i % 3 !== 0])
);

const climateSensors: State[] = CLIMATE_AREAS.flatMap((area) => [
    makeClimateSensor(area, "temperature"),
    makeClimateSensor(area, "humidity"),
]);

export const getSmartEntities = (): { entities: State[] } => {
    const switches = SWITCH_NAMES.map((name) =>
        makeSwitch(name, switchState.get(entityId("switch", name)) ?? false)
    );
    // Re-roll climate values slightly so polling shows life-like drift.
    const sensors = climateSensors.map((sensor) => {
        const base = parseFloat(sensor.state ?? "0");
        const isTemp = sensor.attributes?.device_class === "temperature";
        const drift = (Math.random() - 0.5) * (isTemp ? 0.6 : 2);
        return {
            ...sensor,
            state: `${round(base + drift, isTemp ? 1 : 0)}`,
        };
    });
    return { entities: [...switches, ...sensors] };
};

export const setSwitchState = (entity: string, state: "on" | "off"): void => {
    if (switchState.has(entity)) {
        switchState.set(entity, state === "on");
    }
};
