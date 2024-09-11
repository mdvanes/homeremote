import { List, Paper } from "@mui/material";
import { FC } from "react";
import { useGetSwitchesQuery } from "../../../Services/generated/switchesApi";
import { SwitchesListItem } from "./SwitchesListItem";

export const SwitchesCard: FC = () => {
    // const items: any[] = [{}];
    const { data } = useGetSwitchesQuery();

    return (
        <List component={Paper}>
            {/* <LoadingDot isLoading={isLoading || isFetching} /> */}
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
