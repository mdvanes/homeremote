import { components, operations } from "./generated/smartEntities";

export type UpdateSmartEntityArgs =
    operations["updateSmartEntity"]["requestBody"]["content"]["application/json"];

export type UpdateSmartEntityResponse =
    operations["updateSmartEntity"]["responses"]["200"]["content"]["application/json"];

export type GetSmartEntitiesResponse =
    operations["getSmartEntities"]["responses"]["200"]["content"]["application/json"];

export type State = components["schemas"]["State"];
