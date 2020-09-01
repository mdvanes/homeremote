import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Alternatively use process.env.NODE_ENV that is automatically set to development or production
const getRootUrl = (): string =>
    process.env.REACT_APP_STAGE === "development"
        ? "http://localhost:3001"
        : "";

export const getSwitches = createAsyncThunk(
    `switchesList/getSwitches`,
    async (_, { rejectWithValue }) => {
        // try {
        const response = await fetch(`${getRootUrl()}/api/switches`, {
            credentials: "same-origin",
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const json = await response.json();
        // TODO clean up
        if (json.error) {
            throw new Error(`getSwitches ${json.error}`);
        }
        return json;
        // } catch (err) {
        //     return rejectWithValue("blaat");
        // }
    }
);

export interface SwitchBarListState {
    switches: any[];
    isLoading: boolean;
    error: string | false;
}

const initialState: SwitchBarListState = {
    switches: [],
    isLoading: false,
    error: false,
};

const switchBarListSlice = createSlice({
    name: "switchesList",
    initialState,
    reducers: {},
    extraReducers: {
        [getSwitches.fulfilled.toString()]: (state, { payload }): void => {
            console.log(payload);
            state.isLoading = false;
            state.switches = payload.switches;
        },
        [getSwitches.pending.toString()]: (state, { payload }): void => {
            state.error = false;
            state.isLoading = true;
        },
        [getSwitches.rejected.toString()]: (state, { error }): void => {
            state.isLoading = false;
            state.switches = [];
            state.error = error.message;
        },
    },
});

// export const { } = switchBarListSlice.actions;

export default switchBarListSlice.reducer;
