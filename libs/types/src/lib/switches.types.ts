import { operations } from "./generated/switches";

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
    origin: "domoticz";
}

export interface HomeRemoteHaSwitch {
    idx: string;
    name: string;
    type: DomoticzType;
    status: DomoticzStatus;
    dimLevel: number | null;
    readOnly: boolean;
    children?: HomeRemoteSwitch[] | false;
    origin: "home-assistant";
}

export interface SwitchesResponse {
    status: "received" | "error";
    switches?: Array<HomeRemoteSwitch | HomeRemoteHaSwitch>;
}

export type UpdateHaSwitchArgs =
    operations["updateHaSwitch"]["requestBody"]["content"]["application/json"];

export type UpdateHaSwitchResponse =
    operations["updateHaSwitch"]["responses"]["200"]["content"]["application/json"];
