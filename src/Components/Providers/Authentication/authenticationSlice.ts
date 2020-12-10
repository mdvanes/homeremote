import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetchToJson from "../../../fetchToJson";
import ApiBaseState from "../../../Reducers/state.types";

export interface AuthenticationState extends ApiBaseState {
    id: number;
    displayName: string;
    isOffline: boolean;
    isSignedIn: boolean;
}

export const initialState: AuthenticationState = {
    id: 0,
    displayName: "",
    isLoading: false,
    isOffline: false,
    isSignedIn: false,
    error: false,
};

export enum FetchAuthType {
    Login,
    Logout,
    Current,
}

const authEndpoint: Record<FetchAuthType, string> = {
    [FetchAuthType.Login]: "/auth/login",
    [FetchAuthType.Logout]: "/auth/logout",
    [FetchAuthType.Current]: "/api/profile/current",
};

interface FetchAuthReturned {
    id: number;
    displayName: string;
}

interface FetchAuthArgs {
    type: FetchAuthType;
    init?: RequestInit;
}

export const fetchAuth = createAsyncThunk<FetchAuthReturned, FetchAuthArgs>(
    `authentication/fetchAuth`,
    async ({ type, init }) =>
        fetchToJson<FetchAuthReturned>(authEndpoint[type], init)
);

const authenticationSlice = createSlice({
    name: "authentication",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAuth.pending, (draft, { payload }): void => {
            draft.error = initialState.error;
            draft.isLoading = true;
        });
        builder.addCase(fetchAuth.fulfilled, (draft, { payload }): void => {
            draft.isLoading = initialState.isLoading;
            draft.id = payload.id;
            draft.displayName = payload.displayName;
            draft.isOffline = payload.displayName === "OFFLINE";
            draft.isSignedIn = payload.displayName !== "";
        });
        builder.addCase(fetchAuth.rejected, (draft, { error }): void => {
            draft.isLoading = initialState.isLoading;
            draft.id = initialState.id;
            draft.displayName = initialState.displayName;
            draft.isOffline = initialState.isOffline;
            draft.isSignedIn = initialState.isSignedIn;
            draft.error = error.message || "An error occurred";
        });
    },
});

export default authenticationSlice.reducer;
