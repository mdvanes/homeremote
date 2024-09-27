import { components, operations } from "./external/generated/speedTestTracker";
import * as Internal from "./generated/speedTest";

export type GetSpeedTestTrackerResponse =
    operations["getSpeedTestTrackerLatest"]["responses"]["200"]["content"]["application/json"];

export type SpeedTestTrackerResult = components["schemas"]["SpeedTestResult"];

export type GetSpeedTestResponse =
    Internal.operations["getSpeedtest"]["responses"]["200"]["content"]["application/json"];
