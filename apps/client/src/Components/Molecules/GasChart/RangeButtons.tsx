import { Button, Stack } from "@mui/material";
import { FC } from "react";
import { Range } from "../../../Services/generated/energyUsageApiWithRetry";

const rangeButtonLabel: Record<Range, string> = {
    day: "24H",
    week: "Week",
    month: "Month",
};

const RangeButton: FC<{
    option: Range;
    range: Range;
    setRange: (_: Range) => void;
}> = ({ option, range, setRange }) => {
    return (
        <Button
            variant={range === option ? "contained" : "outlined"}
            onClick={() => {
                setRange(option);
            }}
        >
            {rangeButtonLabel[option]}
        </Button>
    );
};

export const RangeButtons: FC<{
    range: Range;
    setRange: (_: Range) => void;
}> = (props) => {
    return (
        <Stack direction="row" spacing={1} marginBottom={1}>
            <RangeButton {...props} option="day" />
            <RangeButton {...props} option="week" />
            <RangeButton {...props} option="month" />
        </Stack>
    );
};
