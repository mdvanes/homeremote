import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import fetchToJson from "../../../fetchToJson";
import { RootState } from "../../../Reducers";
import ApiBaseState from "../../../Reducers/state.types";

interface FormField {
    value: string;
    error: string | false;
}

export interface UrlToMusicState extends ApiBaseState {
    url: string;
    urlError: string | false;
    title: string;
    form: Record<string, FormField>;
}

export const initialState: UrlToMusicState = {
    url: "",
    urlError: false,
    title: "",
    isLoading: false,
    error: false,
    form: {
        url: {
            value: "",
            error: false,
        },
    },
};

interface FetchInfoReturned {
    // url: string;
    title: string;
}

export const getInfo = createAsyncThunk<FetchInfoReturned>(
    `urlToMusic/getInfo`,
    async (_, { getState, dispatch }) => {
        const url = (getState() as RootState).urlToMusic.form.url.value;
        return fetchToJson<FetchInfoReturned>("/api/urltomusic/getinfo", {
            method: "POST",
            body: JSON.stringify({ url }),
        });
    }
);

type NameAndValue = [string, string];

const urlToMusicSlice = createSlice({
    name: "urlToMusic",
    initialState,
    reducers: {
        setFormField: (
            draft,
            { payload }: PayloadAction<NameAndValue>
        ): void => {
            const [name, value] = payload;
            draft.form[name].value = value;
            draft.form[name].error = "";
        },
        setFormFieldError: (
            draft,
            { payload }: PayloadAction<NameAndValue>
        ): void => {
            const [name, error] = payload;
            draft.form[name].error = error;
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

export const { setFormField, setFormFieldError } = urlToMusicSlice.actions;

export default urlToMusicSlice.reducer;
