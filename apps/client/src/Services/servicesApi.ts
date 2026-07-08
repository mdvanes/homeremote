import { ServiceActionResponse, ServicesResponse } from "@homeremote/types";
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
    }),
});

export const {
    useGetServicesQuery,
    useControlContainerMutation,
    useControlStackMutation,
} = servicesApi;
