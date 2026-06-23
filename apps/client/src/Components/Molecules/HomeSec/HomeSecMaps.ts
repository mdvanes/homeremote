import { HomesecStatusResponse, TypeF } from "@homeremote/types";

export const statusClass: Record<
    HomesecStatusResponse["status"] | "Error",
    string
> = {
    Error: "black",
    Disarm: "green",
    "Home Arm 1": "yellow",
    "Full Arm": "red",
};

export const typeIcon: Record<TypeF, string> = {
    "Door Contact": "sensor_door",
    "Smoke Detector": "smoking_rooms",
    Keypad: "keyboard",
    IR: "animation",
    "Remote Controller": "settings_remote",
    Siren: "notifications",
    CO: "smoking_rooms",
};
