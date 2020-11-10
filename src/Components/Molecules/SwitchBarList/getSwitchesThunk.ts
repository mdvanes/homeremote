import { createAsyncThunk } from "@reduxjs/toolkit";

// Extracted from switchBarListSlice to be able to mock it
export const getSwitches = createAsyncThunk(
    `switchesList/getSwitches`,
    async (_, { rejectWithValue }) => {
        const response = await fetch(
            `${process.env.REACT_APP_BASE_URL}/api/switches`,
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

        if (!response.ok) {
            throw new Error(`getAppStatus ${response.statusText}`);
        }
        const json = await response.json();

        if (json.error) {
            throw new Error(`getSwitches ${json.error}`);
        }
        return json;
    }
);
