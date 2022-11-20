import { ShowNextUpItem } from "@homeremote/types";
import { Dialog, List, Paper } from "@mui/material";
import { FC, useState } from "react";
import { useGetNextupQuery } from "../../../Services/nextupApi";
import { NextupListItem } from "./NextupListItem";
import { SelectedItemDialogContent } from "./SelectedItemDialogContent";

// TODO reduce padding
const Nextup: FC = () => {
    const [selectedItem, setSelectedItem] = useState<ShowNextUpItem>();
    // TODO poll 1x per hour
    const { data } = useGetNextupQuery(undefined);
    if (!data) {
        return null;
    }
    return (
        <>
            <List component={Paper}>
                {/* TODO collapsed 3, expanded max */}
                {data.items.slice(0, 8).map((item) => (
                    <NextupListItem
                        item={item}
                        setSelectedItem={setSelectedItem}
                    />
                ))}
            </List>
            <Dialog
                open={Boolean(selectedItem)}
                onClick={() => setSelectedItem(undefined)}
                fullWidth
                maxWidth="md"
            >
                <SelectedItemDialogContent item={selectedItem} />
            </Dialog>
        </>
    );
};

export default Nextup;
