import { HomesecStatusResponse } from "@homeremote/types";
import { Icon, Tooltip } from "@mui/material";
import { FC } from "react";

const getRssiIcon = (rssi: number): string => {
    if (rssi <= 1) {
        return "";
    }

    if (rssi <= 4) {
        return "signal_cellular_alt_1_bar";
    }

    if (rssi <= 8) {
        return "signal_cellular_alt_2_bar";
    }

    return "signal_cellular_alt";
};

export const RssiIcon: FC<{
    rssi: HomesecStatusResponse["devices"][0]["rssi"];
}> = ({ rssi }) => {
    const [, rssiVal] = rssi.split(", ");
    const rssiNr = parseInt(rssiVal, 10);

    return (
        <Tooltip title={rssi}>
            <Icon>{getRssiIcon(rssiNr)}</Icon>
        </Tooltip>
    );
};
