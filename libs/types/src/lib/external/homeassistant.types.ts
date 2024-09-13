import { components, operations } from "./generated/homeAssistant";

export type GetHaSensorHistoryResponse =
    operations["getHaSensorHistory"]["responses"]["200"]["content"]["application/json"];

export type GetHaStatesResponse =
    | operations["getHaStates"]["responses"]["200"]["content"]["application/json"]
    | operations["getHaStates"]["responses"]["400"]["content"]["application/json"];

export type State = components["schemas"]["State"];

export type PostServicesDomainServiceBody =
    components["schemas"]["PostServicesDomainServiceBody"];

export type PostServicesDomainServiceResponse =
    | operations["postServicesDomainService"]["responses"]["200"]["content"]["application/json"]
    | operations["postServicesDomainService"]["responses"]["400"]["content"]["application/json"];
