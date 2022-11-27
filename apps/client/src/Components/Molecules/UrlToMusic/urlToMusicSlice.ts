import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ApiBaseState from "../../../Reducers/state.types";
import { urlToMusicApi } from "../../../Services/urlToMusicApi";

interface FormField {
    value: string;
    error: string | false;
}

export interface UrlToMusicState extends ApiBaseState {
    form: Record<string, FormField>;
    showGetMusicForm: boolean;
    result: string | false;
}

const year = new Date().getFullYear();

export const initialState: UrlToMusicState = {
    isLoading: false,
    error: false,
    showGetMusicForm: false,
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

type NameAndValue = [string, string];

const urlToMusicSlice = createSlice({
    name: "urlToMusic",
    initialState,
    reducers: {
        reset: (draft) => {
            const url = draft.form.url.value;
            return {
                ...initialState,
                form: {
                    ...initialState.form,
                    url: {
                        ...initialState.form.url,
                        value: url,
                    },
                },
            };
        },
        resetAll: () => {
            return initialState;
        },
        resetProgressLoading: (draft) => {
            draft.isLoading = false;
        },
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
        builder.addMatcher(
            urlToMusicApi.endpoints.getInfo.matchFulfilled,
            (draft, { payload }): void => {
                draft.isLoading = initialState.isLoading;
                draft.form.title.value = payload.title;
                draft.form.title.error = false;
                draft.form.artist.value = payload.artist;
                draft.form.artist.error = false;
                draft.showGetMusicForm = true;
            }
        );
        builder.addMatcher(
            urlToMusicApi.endpoints.getMusic.matchFulfilled,
            (draft, { payload }): void => {
                draft.isLoading = true;
            }
        );
        builder.addMatcher(
            urlToMusicApi.endpoints.getMusicProgress.matchFulfilled,
            (draft, { payload }): void => {
                if (payload.state === "finished") {
                    draft.isLoading = initialState.isLoading;
                    draft.result = payload.path;
                }
            }
        );
    },
});

export const {
    setFormField,
    setFormFieldError,
    reset,
    resetAll,
    resetProgressLoading,
} = urlToMusicSlice.actions;

export default urlToMusicSlice.reducer;
