import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { logInfo } from "../Log/logSlice";
import { DSwitch } from "../../../Reducers/switchesList";

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
        const json = await response.json();

        if (json.error) {
            throw new Error(`getSwitches ${json.error}`);
        }
        return json;
    }
);

export const sendSwitchState = createAsyncThunk<
    void,
    { id: string; state: "on" | "off"; type: string }
>(
    `switchesList/sendSwitchState`,
    async ({ id, state, type }, { rejectWithValue, dispatch }) => {
        const response = await fetch(
            `${process.env.REACT_APP_BASE_URL}/api/switches/${id}`,
            {
                credentials: "same-origin",
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    state,
                    type,
                }),
            }
        );
        const json = await response.json();
        if (json.status !== "received") {
            throw new Error(`Can't set ${state}: ${json.status}`);
        } else {
            dispatch(logInfo(`Switch ${id} ${state}`));
        }
        dispatch(getSwitches());
    }
);

export interface SwitchBarListState {
    switches: DSwitch[];
    isLoading: boolean;
    error: string | false;
    expanded: string[];
}

const initialState: SwitchBarListState = {
    switches: [],
    isLoading: false,
    error: false,
    expanded: [],
};

const switchBarListSlice = createSlice({
    name: "switchesList",
    initialState,
    reducers: {
        toggleExpandScene: (state, { payload: { sceneIdx } }): void => {
            console.log("toggle expand", sceneIdx);
            if (state.expanded.includes(sceneIdx)) {
                // Exists already, so toggle to "collapsed" and remove from the expanded array
                state.expanded = state.expanded.filter(id => id !== sceneIdx);
            } else {
                // Does not exist yet, so toggle to "expanded" and add to the expanded array
                state.expanded.push(sceneIdx);
            }
        },
    },
    extraReducers: {
        [getSwitches.fulfilled.toString()]: (state, { payload }): void => {
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
        [sendSwitchState.fulfilled.toString()]: (state): void => {
            state.isLoading = false;
        },
        [sendSwitchState.pending.toString()]: (state): void => {
            state.error = false;
            state.isLoading = true;
        },
        [sendSwitchState.rejected.toString()]: (state, { error }): void => {
            state.isLoading = false;
            state.error = error.message;
        },
    },
});

export const { toggleExpandScene } = switchBarListSlice.actions;

export default switchBarListSlice.reducer;
