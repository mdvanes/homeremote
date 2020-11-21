import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import ApiBaseState from "../../../Reducers/state.types";
import { logInfo } from "../LogCard/logSlice";
import { DSwitch, getSwitches } from "./getSwitchesThunk";

export const sendSwitchState = createAsyncThunk<
    void,
    { id: string; state: "on" | "off"; type: string }
>(
    `switchesList/sendSwitchState`,
    async ({ id, state, type }, { rejectWithValue, dispatch }) => {
        const response = await fetch(
            `${process.env.REACT_APP_BASE_URL}/api/switches/${id}`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
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

export interface SwitchBarListState extends ApiBaseState {
    switches: DSwitch[];
    expanded: string[];
}

export const initialState: SwitchBarListState = {
    switches: [],
    isLoading: false,
    error: false,
    expanded: [],
};

const switchBarListSlice = createSlice({
    name: "switchesList",
    initialState,
    reducers: {
        toggleExpandScene: (
            state,
            { payload: { sceneIdx } }: PayloadAction<{ sceneIdx: string }>
        ): void => {
            if (state.expanded.includes(sceneIdx)) {
                // Exists already, so toggle to "collapsed" and remove from the expanded array
                state.expanded = state.expanded.filter((id) => id !== sceneIdx);
            } else {
                // Does not exist yet, so toggle to "expanded" and add to the expanded array
                state.expanded.push(sceneIdx);
            }
        },
    },
    extraReducers: (builder) => {
        // [getSwitches.pending.toString()]: (state, { payload }): void => {
        //     state.error = false;
        //     state.isLoading = true;
        // },
        // [getSwitches.fulfilled.toString()]: (state, { payload }): void => {
        //     state.isLoading = false;
        //     state.switches = payload.switches;
        // },
        // [getSwitches.rejected.toString()]: (state, { error }): void => {
        //     state.isLoading = false;
        //     state.switches = [];
        //     state.error = error.message;
        // },
        builder.addCase(getSwitches.pending, (draft, { payload }): void => {
            draft.error = initialState.error;
            draft.isLoading = true;
        });
        builder.addCase(getSwitches.fulfilled, (draft, { payload }): void => {
            draft.isLoading = initialState.isLoading;
            draft.switches = payload.switches;
        });
        builder.addCase(getSwitches.rejected, (draft, { error }): void => {
            draft.isLoading = initialState.isLoading;
            draft.switches = [];
            draft.error = error.message || "An error occurred";
        });
        // [sendSwitchState.fulfilled.toString()]: (state): void => {
        //     state.isLoading = false;
        // },
        // [sendSwitchState.pending.toString()]: (state): void => {
        //     state.error = false;
        //     state.isLoading = true;
        // },
        // [sendSwitchState.rejected.toString()]: (state, { error }): void => {
        //     state.isLoading = false;
        //     state.error = error.message;
        // },
    },
});

export const { toggleExpandScene } = switchBarListSlice.actions;

export default switchBarListSlice.reducer;
