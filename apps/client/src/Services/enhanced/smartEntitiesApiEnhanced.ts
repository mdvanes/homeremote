import { smartEntitiesApi } from "../generated/smartEntitiesApi";
import { addTagTypes } from "../generated/smartEntitiesApiWithRetry";

// TODO tagTypes from other api are not invalidating
export const smartEntitiesApiEnhanced = smartEntitiesApi.enhanceEndpoints({
    addTagTypes: addTagTypes,
    endpoints: {
        updateSmartEntity: {
            // NOTE: this must be addTagTypes from smartEntitiesApiWithRetry, it's not invalidating with the tags in smartEntitiesApi
            invalidatesTags: addTagTypes,
        },
    },
});

export const { useUpdateSmartEntityMutation } = smartEntitiesApiEnhanced;
