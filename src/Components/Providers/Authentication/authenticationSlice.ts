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

interface FetchAuthReturned {
    id: number;
    name: string;
}

interface FetchAuthArgs {
    type: FetchAuthType;
    options?: RequestInit;
}

export const fetchAuth = createAsyncThunk<FetchAuthReturned, FetchAuthArgs>(
    `authentication/fetchAuth`,
    async ({ type, options }) => {
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
    }
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
            draft.name = payload.name;
        });
        builder.addCase(fetchAuth.rejected, (draft, { error }): void => {
            draft.isLoading = initialState.isLoading;
            draft.id = initialState.id;
            draft.name = initialState.name;
            draft.error = error.message || "An error occurred";
        });
    },
});

export default authenticationSlice.reducer;
