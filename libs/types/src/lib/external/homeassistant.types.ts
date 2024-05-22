import { operations } from "./generated/homeAssistant";

export type GetHaSensorHistoryResponse =
    operations["getHaSensorHistory"]["responses"]["200"]["content"]["application/json"];

export type GetHaStatesResponse =
    operations["getHaStates"]["responses"]["200"]["content"]["application/json"];
