import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DownloadItem } from "../../../ApiTypes/downloadlist.types";
import fetchToJson from "../../../fetchToJson";

export interface DownloadListState {
    isLoading: boolean;
    downloads: DownloadItem[];
}

type DownloadListResponse =
    | { status: "received"; downloads: DownloadItem[] }
    | { status: "error" };

type DownloadToggleResponse =
    | { status: "received"; message: string }
    | { status: "error" };

export const getDownloadList = createAsyncThunk<DownloadListResponse>(
    `downloadList/getDownloadList`,
    async () => fetchToJson<DownloadListResponse>("/api/downloadlist")
);

// TODO how to check for updates manually? long polling for now?

export const pauseDownload = createAsyncThunk<void, number>(
    `downloadList/pauseDownload`,
    async (id, { dispatch }) => {
        const json = await fetchToJson<DownloadToggleResponse>(
            `/api/downloadlist/pauseDownload/${id}`
        );
        if (json.status !== "received") {
            console.log("not received", json);
            // TODO throw new Error(`Can't set ${state}: ${json.status}`);
        } else {
            console.log("received", json);
            // TODO dispatch(logInfo(`Switch ${id} ${state}`));
        }
        // TODO this is too fast
        setTimeout(() => {
            dispatch(getDownloadList());
        }, 1000);
    }
);

export const resumeDownload = createAsyncThunk<void, number>(
    `downloadList/resumeDownload`,
    async (id, { dispatch }) => {
        // alert("resume");
        const json = await fetchToJson<DownloadToggleResponse>(
            `/api/downloadlist/resumeDownload/${id}`
        );
        if (json.status !== "received") {
            console.log("not received", json);
            // TODO throw new Error(`Can't set ${state}: ${json.status}`);
        } else {
            console.log("received", json);
            // TODO dispatch(logInfo(`Switch ${id} ${state}`));
        }
        // TODO fetch to resumeDownload is finished too fast
        setTimeout(() => {
            dispatch(getDownloadList());
        }, 1000);
    }
);

const initialState: DownloadListState = {
    isLoading: false,
    downloads: [],
};

const downloadListSlice = createSlice({
    name: "downloadList",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getDownloadList.pending, (draft, { payload }): void => {
            // draft.error = initialState.error;
            draft.isLoading = true;
        });
        builder.addCase(
            getDownloadList.fulfilled,
            (draft, { payload }): void => {
                draft.isLoading = initialState.isLoading;
                if (payload.status !== "received") {
                    throw new Error("Unexpected status");
                }
                draft.downloads = payload.downloads;
            }
        );
        builder.addCase(getDownloadList.rejected, (draft, { error }): void => {
            draft.isLoading = initialState.isLoading;
            draft.downloads = [];
            // draft.error = error.message || "An error occurred";
        });
    },
});

// export const {} = downloadListSlice.actions;

export default downloadListSlice.reducer;
