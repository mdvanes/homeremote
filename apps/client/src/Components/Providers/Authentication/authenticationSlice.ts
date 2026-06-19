import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiBaseState from "../../../Reducers/state.types";
import fetchToJson from "../../../fetchToJson";

export interface AuthenticationState extends ApiBaseState {
    id: number;
    displayName: string;
    isOffline: boolean;
    isSignedIn: boolean;
    loginMethod: "local" | "oidc" | null;
    oidcEnabled: boolean;
}

export const initialState: AuthenticationState = {
    id: 0,
    displayName: "",
    isLoading: false,
    isOffline: false,
    isSignedIn: false,
    loginMethod: null,
    oidcEnabled: false,
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
    loginMethod?: "local" | "oidc";
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

interface AuthConfigResponse {
    oidc: {
        enabled: boolean;
    };
}

export const fetchAuthConfig = createAsyncThunk<AuthConfigResponse>(
    `authentication/fetchAuthConfig`,
    async () => fetchToJson<AuthConfigResponse>("/auth/config")
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
            draft.loginMethod = payload.loginMethod ?? null;
        });
        builder.addCase(fetchAuth.rejected, (draft, { error }): void => {
            draft.isLoading = initialState.isLoading;
            draft.id = initialState.id;
            draft.displayName = initialState.displayName;
            draft.isOffline = initialState.isOffline;
            draft.isSignedIn = initialState.isSignedIn;
            draft.loginMethod = initialState.loginMethod;
            draft.error = error.message || "An error occurred";
        });
        builder.addCase(
            fetchAuthConfig.fulfilled,
            (draft, { payload }): void => {
                draft.oidcEnabled = payload.oidc.enabled;
            }
        );
    },
});

export default authenticationSlice.reducer;
