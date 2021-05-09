import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetchToJson from "../../../fetchToJson";

type DownloadStatus = "Stopped" | "Downloading";

interface DownloadItem {
    id: number;
    name: string;
    percentage: number;
    status: DownloadStatus;
    size: string;
}

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

export const pauseDownload = createAsyncThunk<DownloadToggleResponse, number>(
    `downloadList/pauseDownload`,
    async (id) =>
        fetchToJson<DownloadToggleResponse>(
            `/api/downloadlist/pauseDownload/${id}`
        )
    // TODO after sending id, also get the new getDownloadList
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
