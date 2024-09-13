import { State } from "../../../Services/generated/smartEntitiesApi";

// device_class is undefined for switches
export const isSwitch = (s: State) =>
    typeof s?.attributes?.device_class === "undefined";

export const isClimateSensor = (s: State) =>
    ["temperature", "humidity"].includes(s?.attributes?.device_class ?? "");

export const sortClimateSensors = (a: State, b: State) => {
    const aName = a.attributes?.friendly_name ?? "";
    const bName = b.attributes?.friendly_name ?? "";
    const aClass = a.attributes?.device_class ?? "";
    const bClass = b.attributes?.device_class ?? "";
    if (aName < bName) {
        return -1;
    }
    if (aName > bName) {
        return 1;
    }
    if (aClass < bClass) {
        return -1;
    }
    if (aClass > bClass) {
        return 1;
    }
    return 0;
};
