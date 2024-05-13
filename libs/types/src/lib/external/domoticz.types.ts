import { operations } from "./generated/domoticz";

export type GetDomoticzJsonExport =
    operations["getJsonExport"]["responses"]["200"]["content"]["application/json"];

export type GetDomoticzUsePerDayResponse =
    operations["getUsePerDay"]["responses"]["200"]["content"]["application/json"];
