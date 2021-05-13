import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DownloadItem } from "../../../ApiTypes/downloadlist.types";
import fetchToJson from "../../../fetchToJson";
import { logError, logInfo } from "../LogCard/logSlice";

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

const toggleDownload = (endpoint: "resumeDownload" | "pauseDownload") =>
    createAsyncThunk<void, number>(
        `downloadList/${endpoint}`,
        async (id, { dispatch }) => {
            const json = await fetchToJson<DownloadToggleResponse>(
                `/api/downloadlist/${endpoint}/${id}`
            );
            if (json.status !== "received") {
                dispatch(
                    logError(`Can't toggle download ${id}: ${json.status}`)
                );
            } else {
                dispatch(logInfo(`Toggle download ${id}`));
            }
            // NOTE: fetch to resumeDownload is finished before getDownloadList can give a new result
            setTimeout(() => {
                dispatch(getDownloadList());
            }, 1000);
        }
    );

export const pauseDownload = toggleDownload("pauseDownload");
export const resumeDownload = toggleDownload("resumeDownload");

export const initialState: DownloadListState = {
    isLoading: false,
    downloads: [],
};

const downloadListSlice = createSlice({
    name: "downloadList",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getDownloadList.pending, (draft, { payload }): void => {
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
        });
    },
});

export default downloadListSlice.reducer;
