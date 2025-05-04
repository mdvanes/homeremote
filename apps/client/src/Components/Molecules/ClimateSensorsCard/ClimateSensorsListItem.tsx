import { Stack } from "@mui/material";
import { FC } from "react";
import { State } from "../../../Services/generated/smartEntitiesApiWithRetry";
import { ClimateSensorsListItemContent } from "./ClimateSensorListItemContent";

interface ClimateSensorsListItemProps {
    sensors: State[];
}

export const ClimateSensorsListItem: FC<ClimateSensorsListItemProps> = ({
    sensors,
}) => {
    return (
        <Stack direction="row" flexWrap="wrap">
            {sensors.map((t) => (
                <Stack
                    key={t.entity_id}
                    direction="row"
                    alignItems="center"
                    sx={{ paddingX: 2, flexGrow: 1 }}
                >
                    <ClimateSensorsListItemContent sensor={t} />
                </Stack>
            ))}
        </Stack>
    );
};
