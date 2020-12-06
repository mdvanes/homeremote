import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import fetchToJson from "../../../fetchToJson";
import { RootState } from "../../../Reducers";
import ApiBaseState from "../../../Reducers/state.types";
import { logInfo } from "../LogCard/logSlice";

interface FormField {
    value: string;
    error: string | false;
}

export interface UrlToMusicState extends ApiBaseState {
    form: Record<string, FormField>;
    result: string | false;
}

const year = new Date().getFullYear();

export const initialState: UrlToMusicState = {
    isLoading: false,
    error: false,
    form: {
        url: {
            value: "",
            error: false,
        },
        title: {
            value: "",
            error: false,
        },
        artist: {
            value: "",
            error: false,
        },
        album: {
            value: `Songs from ${year}`,
            error: false,
        },
    },
    result: false,
};

interface FetchInfoReturned {
    title: string;
    artist: string;
    versionInfo: string;
}

interface FetchMusicReturned {
    path: string;
    fileName: string;
}

export const getInfo = createAsyncThunk<FetchInfoReturned>(
    `urlToMusic/getInfo`,
    async (_, { getState, dispatch }) => {
        const url = (getState() as RootState).urlToMusic.form.url.value;
        const result = await fetchToJson<FetchInfoReturned>(
            "/api/urltomusic/getinfo",
            {
                method: "POST",
                body: JSON.stringify({ url }),
            }
        );
        dispatch(
            logInfo(
                `Finished getInfo with bin version info: ${result.versionInfo}`
            )
        );
        return result;
    }
);

export const getMusic = createAsyncThunk<FetchMusicReturned>(
    `urlToMusic/getMusic`,
    async (_, { getState, dispatch }) => {
        const form = (getState() as RootState).urlToMusic.form;
        const fieldEntries = Object.entries(form).map(([fieldName, field]) => [
            fieldName,
            field.value,
        ]);
        const body = JSON.stringify(Object.fromEntries(fieldEntries));
        dispatch(
            logInfo(
                `Started getMusic: ${fieldEntries
                    .map(([fieldName, value]) => `${fieldName}=${value}`)
                    .join("; ")}`
            )
        );
        const result = await fetchToJson<FetchMusicReturned>(
            "/api/urltomusic/getmusic",
            {
                method: "POST",
                body,
            }
        );
        dispatch(logInfo(`Finished getMusic: ${result.path}`));
        return result;
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
            draft.result = initialState.result;
        });
        builder.addCase(getInfo.fulfilled, (draft, { payload }): void => {
            draft.isLoading = initialState.isLoading;
            draft.form.title.value = payload.title;
            draft.form.artist.value = payload.artist;
        });
        builder.addCase(getInfo.rejected, (draft, { error }): void => {
            draft.isLoading = initialState.isLoading;
            draft.error = error.message || "An error occurred";
        });
        builder.addCase(getMusic.pending, (draft, { payload }): void => {
            draft.error = initialState.error;
            draft.isLoading = true;
            draft.result = initialState.result;
        });
        builder.addCase(getMusic.fulfilled, (draft, { payload }): void => {
            draft.isLoading = initialState.isLoading;
            draft.result = payload.path;
        });
        builder.addCase(getMusic.rejected, (draft, { error }): void => {
            draft.isLoading = initialState.isLoading;
            draft.error = error.message || "An error occurred";
        });
    },
});

export const { setFormField, setFormFieldError } = urlToMusicSlice.actions;

export default urlToMusicSlice.reducer;
