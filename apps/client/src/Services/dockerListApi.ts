import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { willAddCredentials } from "../devUtils";

export interface DockerContainerInfo {
    Id: string;
    Names: string[];
    State: string;
    Status: string;
}

interface DockerListResponse {
    status: "received" | "error";
    containers?: DockerContainerInfo[];
}

interface ToggleArgs {
    id: string;
}

export const dockerListApi = createApi({
    reducerPath: "dockerListApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NX_BASE_URL}/api/dockerlist`,
        credentials: willAddCredentials(),
    }),
    tagTypes: ["DockerItem"],
    endpoints: (builder) => ({
        getDockerList: builder.query<DockerListResponse, undefined>({
            query: () => "",
            providesTags: ["DockerItem"],
        }),
        startDocker: builder.mutation<DockerListResponse, ToggleArgs>({
            query: ({ id }) => ({
                url: `start/${id}`,
            }),
            invalidatesTags: ["DockerItem"],
        }),
        stopDocker: builder.mutation<DockerListResponse, ToggleArgs>({
            query: ({ id }) => ({
                url: `stop/${id}`,
            }),
            invalidatesTags: ["DockerItem"],
        }),
    }),
});

export const {
    useGetDockerListQuery,
    useStartDockerMutation,
    useStopDockerMutation,
} = dockerListApi;
