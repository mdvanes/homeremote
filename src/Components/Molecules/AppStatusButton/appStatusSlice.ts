import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ApiBaseState { 
    isLoading: boolean;
    error: string | false;
}

export interface AppStatusState extends ApiBaseState {
    status: string,
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
                credentials: "same-origin",
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        const json = await response.json();

        // if (json.status !== "received") { 
        //     throw new Error(`Can't set ???`);
        // }
        if (json.error) {
            throw new Error(`getSwitches ${json.error}`);
        }        
        return json;
    }
);

const appStatusSlice = createSlice({
    name: "appStatus",
    initialState,
    reducers: {
        [getAppStatus.fulfilled.toString()]: (state, { payload }): void => {
            state.isLoading = false;
            state.status = payload;
        },
        [getAppStatus.pending.toString()]: (state, { payload }): void => {
            state.error = false;
            state.isLoading = true;
        },
        [getAppStatus.rejected.toString()]: (state, /* { error } */ data): void => {
            console.log(data)
            state.isLoading = false;
            state.status = "";
            // state.error = error.message;
        },
    },
});

export const { logInfo, logError, clearLog } = appStatusSlice.actions;

export default appStatusSlice.reducer;
