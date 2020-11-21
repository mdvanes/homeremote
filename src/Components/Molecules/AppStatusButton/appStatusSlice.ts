import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetchToJson from "../../../fetchToJson";
import ApiBaseState from "../../../Reducers/state.types";

export interface AppStatusState extends ApiBaseState {
    status: string;
}

export const initialState: AppStatusState = {
    status: "",
    isLoading: false,
    error: false,
};

interface FetchReturned {
    status: string;
}

export const getAppStatus = createAsyncThunk<FetchReturned>(
    `appStatus/getAppStatus`,
    async () => fetchToJson<FetchReturned>("/api/status")
);

const appStatusSlice = createSlice({
    name: "appStatus",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAppStatus.pending, (draft, { payload }): void => {
            draft.error = initialState.error;
            draft.isLoading = true;
        });
        builder.addCase(getAppStatus.fulfilled, (draft, { payload }): void => {
            draft.isLoading = initialState.isLoading;
            draft.status = payload.status;
        });
        builder.addCase(getAppStatus.rejected, (draft, { error }): void => {
            draft.isLoading = initialState.isLoading;
            draft.status = "";
            draft.error = error.message || "An error occurred";
        });
    },
});

export default appStatusSlice.reducer;
