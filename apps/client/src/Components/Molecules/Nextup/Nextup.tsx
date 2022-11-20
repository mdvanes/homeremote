import { ShowNextUpItem } from "@homeremote/types";
import { Button, Dialog, DialogActions, List, Paper } from "@mui/material";
import { FC, useState } from "react";
import { useGetNextupQuery } from "../../../Services/nextupApi";
import CardExpandBar from "../CardExpandBar/CardExpandBar";
import LoadingDot from "../LoadingDot/LoadingDot";
import { NextupListItem } from "./NextupListItem";
import { SelectedItemDialogContent } from "./SelectedItemDialogContent";

const CUTOFF = 3;

// Rarely updates, only check once per hour
const UPDATE_INTERVAL_MS = 60 * 60 * 1000;

const Nextup: FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ShowNextUpItem>();
    const { data, isLoading, isFetching } = useGetNextupQuery(undefined, {
        pollingInterval: UPDATE_INTERVAL_MS,
    });
    if (!data) {
        return null;
    }
    const items = isOpen ? data.items : data.items.slice(0, CUTOFF);
    return (
        <>
            <List component={Paper}>
                <LoadingDot isLoading={isLoading || isFetching} />
                {items.map((item) => (
                    <NextupListItem
                        key={item.Id}
                        item={item}
                        setSelectedItem={setSelectedItem}
                    />
                ))}
                <CardExpandBar
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    hint={`and ${data.items.length - CUTOFF} more`}
                />
            </List>
            <Dialog
                open={Boolean(selectedItem)}
                onBackdropClick={() => {
                    setSelectedItem(undefined);
                }}
                fullWidth
                maxWidth="md"
            >
                <SelectedItemDialogContent item={selectedItem} />
                <DialogActions>
                    <Button
                        onClick={() => {
                            setSelectedItem(undefined);
                        }}
                    >
                        close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Nextup;
