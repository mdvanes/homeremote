import { HomeRemoteSwitch, SwitchesResponse } from "@homeremote/types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import fetchToJson from "../../../fetchToJson";
import ApiBaseState from "../../../Reducers/state.types";
import { logInfo } from "../LogCard/logSlice";
import { getSwitches } from "./getSwitchesThunk";

export const sendSwitchState = createAsyncThunk<
    void,
    { id: string; state: "on" | "off"; type: string }
>(
    `switchesList/sendSwitchState`,
    async ({ id, state, type }, { rejectWithValue, dispatch }) => {
        const json = await fetchToJson<SwitchesResponse>(
            `/api/switches/${id}`,
            {
                method: "POST",
                body: JSON.stringify({
                    state,
                    type,
                }),
            }
        );
        if (json.status !== "received") {
            throw new Error(`Can't set ${state}: ${json.status}`);
        } else {
            dispatch(logInfo(`Switch ${id} ${state}`));
        }
        dispatch(getSwitches());
    }
);

export interface SwitchBarListState extends ApiBaseState {
    switches: HomeRemoteSwitch[];
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
        builder.addCase(getSwitches.pending, (draft, { payload }): void => {
            draft.error = initialState.error;
            draft.isLoading = true;
        });
        builder.addCase(getSwitches.fulfilled, (draft, { payload }): void => {
            draft.isLoading = initialState.isLoading;
            draft.switches = payload.switches ?? [];
        });
        builder.addCase(getSwitches.rejected, (draft, { error }): void => {
            draft.isLoading = initialState.isLoading;
            draft.switches = [];
            draft.error = error.message || "An error occurred";
        });
        builder.addCase(sendSwitchState.pending, (draft, { payload }): void => {
            draft.error = initialState.error;
            draft.isLoading = true;
        });
        builder.addCase(
            sendSwitchState.fulfilled,
            (draft, { payload }): void => {
                draft.isLoading = initialState.isLoading;
            }
        );
        builder.addCase(sendSwitchState.rejected, (draft, { error }): void => {
            draft.isLoading = initialState.isLoading;
            draft.error = error.message || "An error occurred";
        });
    },
});

export const { toggleExpandScene } = switchBarListSlice.actions;

export default switchBarListSlice.reducer;
