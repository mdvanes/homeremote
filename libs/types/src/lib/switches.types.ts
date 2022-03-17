// TODO avoid enum
export enum DomoticzType {
    Group = "Group",
    LightSwitch = "Light/Switch",
    Dimmer = "Dimmer",
    Selector = "Selector",
}

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
