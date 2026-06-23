import { ShowNextUpItem } from "@homeremote/types";
import { Box, Button, Dialog, DialogActions, List, Paper } from "@mui/material";
import { FC, useState } from "react";
import { useGetNextupQuery } from "../../../Services/nextupApi";
import { usePolledQuery } from "../../../Utils/usePolledQuery";
import CardExpandBar from "../CardExpandBar/CardExpandBar";
import { staleContentSx } from "../CardStatus/CardStatus";
import CardStatusBar from "../CardStatusBar/CardStatusBar";
import { NextupListItem } from "./NextupListItem";
import { SelectedItemDialogContent } from "./SelectedItemDialogContent";

const CUTOFF = 3;

// Rarely updates, only check once per hour
const UPDATE_INTERVAL_MS = 60 * 60 * 1000;

const Nextup: FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ShowNextUpItem>();
    const {
        data,
        isLoading,
        isFetching,
        isError,
        isStale,
        lastUpdated,
        retry,
    } = usePolledQuery(useGetNextupQuery, undefined, {
        name: "Next up",
        pollingInterval: UPDATE_INTERVAL_MS,
    });
    if (!data) {
        return null;
    }
    const items = isOpen ? data.items : data.items.slice(0, CUTOFF);

    return (
        <>
            <List component={Paper} sx={{ position: "relative" }}>
                <CardStatusBar
                    isLoading={isLoading || isFetching}
                    name="Next up"
                    isError={isError}
                    isStale={isStale}
                    retry={retry}
                    lastUpdated={lastUpdated}
                />
                <Box sx={staleContentSx(isStale)}>
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
                </Box>
            </List>
            <Dialog
                open={Boolean(selectedItem)}
                onClose={(_event, reason) => {
                    if (reason === "backdropClick") {
                        setSelectedItem(undefined);
                    }
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
