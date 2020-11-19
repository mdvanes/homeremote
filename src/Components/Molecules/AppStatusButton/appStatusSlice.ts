import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiBaseState from "../../../Reducers/state.types";

export interface AppStatusState extends ApiBaseState {
    status: string;
}

export const initialState: AppStatusState = {
    status: "",
    isLoading: false,
    error: false,
};

export const getAppStatus = createAsyncThunk(
    `appStatus/getAppStatus`,
    async () => {
        const response = await fetch(
            `${process.env.REACT_APP_BASE_URL}/api/status`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(`getAppStatus ${response.statusText}`);
        }
        const json = await response.json();

        if (json.error) {
            throw new Error(`getAppStatus ${json.error}`);
        }
        return json;
    }
);

const appStatusSlice = createSlice({
    name: "appStatus",
    initialState,
    reducers: {},
    extraReducers: {
        [getAppStatus.pending.toString()]: (state, { payload }): void => {
            state.error = false;
            state.isLoading = true;
        },
        [getAppStatus.fulfilled.toString()]: (state, { payload }): void => {
            state.isLoading = false;
            state.status = payload.status;
        },
        [getAppStatus.rejected.toString()]: (state, { error }): void => {
            state.isLoading = false;
            state.status = "";
            state.error = error.message;
        },
    },
});

export default appStatusSlice.reducer;
