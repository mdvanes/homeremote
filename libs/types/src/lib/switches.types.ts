export const DomoticzTypeOptions = {
    Group: "Group",
    LightSwitch: "Light/Switch",
    Dimmer: "Dimmer",
    Selector: "Selector",
} as const;

export type DomoticzType =
    typeof DomoticzTypeOptions[keyof typeof DomoticzTypeOptions];

export type DomoticzStatus = string;

export interface HomeRemoteSwitch {
    idx: string;
    name: string;
    type: DomoticzType;
    status: DomoticzStatus;
    dimLevel: number | null;
    readOnly: boolean;
    children?: HomeRemoteSwitch[] | false;
}

export interface SwitchesResponse {
    status: "received" | "error";
    switches?: HomeRemoteSwitch[];
}
