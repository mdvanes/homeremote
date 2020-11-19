import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiBaseState from "../../../Reducers/state.types";

export interface AuthenticationState extends ApiBaseState {
    id: number;
    name: string;
}

export const initialState: AuthenticationState = {
    id: 0,
    name: "",
    isLoading: false,
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

// TODO merge FetchAuthType and authEndpoint___ fix any in this file
// type FetchAuthType = keyof authEndpoint;

export const fetchAuth = createAsyncThunk<
    { id: number; name: string },
    { type: FetchAuthType; options?: any }
>(`authentication/fetchAuth`, async ({ type, options }) => {
    console.log(type, authEndpoint[type]);

    const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}${authEndpoint[type]}`,
        {
            credentials: "same-origin",
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            ...options,
        }
    );

    if (!response.ok) {
        throw new Error(`fetchAuth ${response.statusText}`);
    }
    const json = await response.json();

    if (json.error) {
        throw new Error(`fetchAuth ${json.error}`);
    }
    return json;
});

const authenticationSlice = createSlice({
    name: "authentication",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAuth.pending, (state, { payload }): void => {
            state.error = initialState.error;
            state.isLoading = true;
        });
        builder.addCase(fetchAuth.fulfilled, (state, { payload }): void => {
            state.isLoading = initialState.isLoading;
            state.id = payload.id;
            state.name = payload.name;
        });
        builder.addCase(fetchAuth.rejected, (state, { error }): void => {
            state.isLoading = initialState.isLoading;
            state.id = initialState.id;
            state.name = initialState.name;
            state.error = error.message || "An error occurred";
        });
    },
});

export default authenticationSlice.reducer;
