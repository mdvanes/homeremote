import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import fetchToJson from "../../../fetchToJson";
import { RootState } from "../../../Reducers";
import ApiBaseState from "../../../Reducers/state.types";

export interface UrlToMusicState extends ApiBaseState {
    url: string;
    title: string;
}

export const initialState: UrlToMusicState = {
    url: "",
    title: "",
    isLoading: false,
    error: false,
};

interface FetchInfoReturned {
    // url: string;
    title: string;
}

// TODO take the url param
export const getInfo = createAsyncThunk<FetchInfoReturned>(
    `urlToMusic/getInfo`,
    async (someName, { getState }) => {
        const bladiebla = (getState() as RootState).urlToMusic.url;
        console.log(
            "fo",
            (getState() as RootState).urlToMusic.url,
            // (getState() as any).url,
            someName
        );
        return fetchToJson<FetchInfoReturned>("/api/urltomusic/getinfo", {
            method: "POST",
            // body: JSON.stringify({ url: "foo1" + (getState() as any).url }),
            body: JSON.stringify({ url: bladiebla }),
        });
    }
);

const urlToMusicSlice = createSlice({
    name: "urlToMusic",
    initialState,
    reducers: {
        setUrl: (draft, { payload }: PayloadAction<string>): void => {
            draft.url = payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getInfo.pending, (draft, { payload }): void => {
            draft.error = initialState.error;
            draft.isLoading = true;
        });
        builder.addCase(getInfo.fulfilled, (draft, { payload }): void => {
            draft.isLoading = initialState.isLoading;
            draft.title = payload.title;
        });
        builder.addCase(getInfo.rejected, (draft, { error }): void => {
            draft.isLoading = initialState.isLoading;
            draft.title = "";
            draft.error = error.message || "An error occurred";
        });
    },
});

export const { setUrl } = urlToMusicSlice.actions;

export default urlToMusicSlice.reducer;
