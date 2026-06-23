import { HomesecStatusResponse } from "@homeremote/types";
import { Icon } from "@mui/material";
import { FC } from "react";

export const ConditionIcon: FC<{
    cond_ok: HomesecStatusResponse["devices"][0]["cond_ok"];
}> = ({ cond_ok }) => {
    return cond_ok === "1" ? (
        <Icon
            color="success"
            sx={{
                marginTop: "-0.1rem",
            }}
        >
            check_circle_outline
        </Icon>
    ) : (
        <Icon
            color="error"
            sx={{
                marginTop: "-0.1rem",
            }}
        >
            error_outline
        </Icon>
    );
};
