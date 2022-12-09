import { useGetCarTwinQuery } from "../../../Services/carTwinApi";
import { FC } from "react";

export const CarTwinCard: FC = () => {
    const { data, isLoading, isFetching, error } =
        useGetCarTwinQuery(undefined);

    if (isLoading || isFetching) {
        return <div>loading...</div>;
    }

    if (error || !data) {
        return <div>error</div>;
    }

    return <div>cartwin ${JSON.stringify(data)}</div>;
};
