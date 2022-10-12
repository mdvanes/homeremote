import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
// import { TrackerItem } from "@homeremote/types";
import { willAddCredentials } from "../devUtils";

// type GetCoordsResponse = TrackerItem[];
// type GetCoordsArgs = {
//     type: string;
// };

// type DockerListResponse = {
//     status: "received";
//     containers: Array<{ Id: string; Names: string[] }>;
// };

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
        getDockerList: builder.query<DockerListResponse, {}>({
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

export const { useGetDockerListQuery } = dockerListApi;
