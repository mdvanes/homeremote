import { SwitchesResponse } from "@homeremote/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import fetchToJson from "../../../fetchToJson";

// Extracted from switchBarListSlice to be able to mock it
export const getSwitches = createAsyncThunk<SwitchesResponse>(
    `switchesList/getSwitches`,
    async () => fetchToJson<SwitchesResponse>("/api/switches")
);
