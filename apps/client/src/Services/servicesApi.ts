import {
    ServiceActionResponse,
    ServiceLinkConfigResponse,
    ServiceLinkConfigUpdate,
    ServiceLogsResponse,
    ServicesResponse,
} from "@homeremote/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { willAddCredentials } from "../devUtils";

export type ServiceAction = "start" | "stop" | "restart";

interface ContainerActionArgs {
    id: string;
    action: ServiceAction;
}

interface StackActionArgs {
    id: string;
    endpointId: number;
    action: ServiceAction;
}

interface LinkConfigArgs {
    stack: string;
    config: ServiceLinkConfigUpdate;
}

export const servicesApi = createApi({
    reducerPath: "servicesApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NX_PUBLIC_BASE_URL}/api/services`,
        credentials: willAddCredentials(),
    }),
    tagTypes: ["Service"],
    endpoints: (builder) => ({
        getServices: builder.query<ServicesResponse, undefined>({
            query: () => "",
            providesTags: ["Service"],
        }),
        controlContainer: builder.mutation<
            ServiceActionResponse,
            ContainerActionArgs
        >({
            query: ({ id, action }) => ({
                url: `container/${action}/${id}`,
            }),
            invalidatesTags: ["Service"],
        }),
        controlStack: builder.mutation<ServiceActionResponse, StackActionArgs>({
            query: ({ id, endpointId, action }) => ({
                url: `stack/${action}/${id}?endpointId=${endpointId}`,
            }),
            invalidatesTags: ["Service"],
        }),
        setLinkConfig: builder.mutation<
            ServiceLinkConfigResponse,
            LinkConfigArgs
        >({
            query: ({ stack, config }) => ({
                url: `link/${encodeURIComponent(stack)}`,
                method: "PUT",
                body: config,
            }),
            invalidatesTags: ["Service"],
        }),
        getContainerLogs: builder.query<ServiceLogsResponse, string>({
            query: (id) => `logs/${id}`,
        }),
    }),
});

export const {
    useGetServicesQuery,
    useControlContainerMutation,
    useControlStackMutation,
    useSetLinkConfigMutation,
    useGetContainerLogsQuery,
} = servicesApi;
