import { List, Paper } from "@mui/material";
import { FC } from "react";
import { useGetSwitchesQuery } from "../../../Services/generated/switchesApi";
import LoadingDot from "../LoadingDot/LoadingDot";
import { SwitchesListItem } from "./SwitchesListItem";

const UPDATE_INTERVAL_MS = 1000 * 60; // 1000 ms / 60 seconds = 1x per minute

export const SwitchesCard: FC = () => {
    // const items: any[] = [{}];
    const { data, error, isFetching, isLoading } = useGetSwitchesQuery(
        undefined,
        {
            pollingInterval: UPDATE_INTERVAL_MS,
        }
    );

    console.log(data, error);

    return (
        <List component={Paper}>
            <LoadingDot isLoading={isLoading || isFetching} />
            {(data?.switches ?? []).map((item) => (
                <SwitchesListItem key={item.entity_id} item={item} />
            ))}
            {/* <CardExpandBar
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                hint={`and ${data.items.length - CUTOFF} more`}
            /> */}
        </List>
    );

    // return (
    //     <Card>
    //         <CardContent>
    //             <div>switches card</div>
    //         </CardContent>
    //     </Card>
    // );
};
