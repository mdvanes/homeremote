import { Alert, Stack } from "@mui/material";
import { FC, ReactNode } from "react";

const MonitStatusAlert: FC<{
    status: number;
    name: string;
    children?: ReactNode;
}> = ({ status, name, children }) => (
    <Alert
        severity={status === 0 ? "success" : "error"}
        sx={{ marginBottom: "2px", ".MuiAlert-message": { width: "100%" } }}
    >
        <Stack direction="row">
            <div style={{ flex: 1 }}>{name}</div>
            <div>{children}</div>
        </Stack>
    </Alert>
);

export default MonitStatusAlert;
