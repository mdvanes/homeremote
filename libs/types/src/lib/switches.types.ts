export const DomoticzTypeOptions = {
    Dimmer: "Dimmer",
    Group: "Group",
    LightSwitch: "Light/Switch",
    Scene: "Scene",
    Selector: "Selector",
} as const;

export type DomoticzType =
    typeof DomoticzTypeOptions[keyof typeof DomoticzTypeOptions];

export type DomoticzSendType = "switchscene" | "switchlight" | "selector";

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
