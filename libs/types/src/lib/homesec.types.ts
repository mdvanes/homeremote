export type TypeF =
    | "Door Contact"
    | "Smoke Detector"
    | "Keypad"
    | "IR"
    | "Remote Controller"
    | "Siren"
    | "CO";

interface SensorRow {
    area: number;
    zone: number;
    type: number;
    type_f: TypeF;
    name: string;
    cond: "";
    cond_ok: "0" | "1";
    battery: "";
    battery_ok: "0" | "1";
    tamper: "";
    tamper_ok: "0" | "1";
    bypass: "No" | "Yes";
    temp_bypass: "0" | "1";
    rssi: string; // "Strong, 9";
    status: "" | "Door Close" | "Door Open";
    id: string;
    su: number;
}

export interface HomesecDevicesResponse {
    senrows: SensorRow[];
}

type Modes = "Disarm" | "Home Arm 1" | "Full Arm";

export enum PcondformModes {
    Disarm = "0",
    HomeArm = "2",
}

export interface HomesecPanelResponse {
    updates: {
        mode_a1: Modes;
        mode_a2: Modes;
        battery_ok: "1";
        battery: "Normal";
        tamper_ok: "1";
        tamper: "N/A";
        interference_ok: "1";
        interference: "Normal";
        ac_activation_ok: "1";
        ac_activation: "Normal";
        sys_in_inst: "System in maintenance";
        rssi: "1";
        sig_gsm_ok: "1";
        sig_gsm: "N/A";
    };
    forms: {
        pcondform1: {
            mode: PcondformModes;
            f_arm: "0";
        };
        pcondform2: {
            mode: PcondformModes;
            f_arm: "0";
        };
    };
}

export interface HomesecStatusResponse {
    status: Modes;
    devices: Pick<
        SensorRow,
        "id" | "name" | "type_f" | "status" | "rssi" | "cond_ok"
    >[];
}
