import { createAsyncThunk } from "@reduxjs/toolkit";
import fetchToJson from "../../../fetchToJson";

// TODO deduplicate this fetch to util from appStatusSlice, switchBarListSlice, authenticationSlice

// Domoticz Device Switch
export type DSwitch = {
    idx: string;
    name: string;
    type: string;
    status: string;
    dimLevel: number | null;
    readOnly: boolean;
    children: DSwitch[] | false;
};

interface FetchReturned {
    switches: DSwitch[];
}

// Extracted from switchBarListSlice to be able to mock it
export const getSwitches = createAsyncThunk<FetchReturned>(
    `switchesList/getSwitches`,
    async () => fetchToJson<FetchReturned>("/api/switches")
);
