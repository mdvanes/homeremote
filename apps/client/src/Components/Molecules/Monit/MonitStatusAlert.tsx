import { Alert } from "@mui/material";
import { FC, ReactNode } from "react";

const MonitStatusAlert: FC<{ status: number; children: ReactNode }> = ({
    status,
    children,
}) => (
    <Alert
        severity={status === 0 ? "success" : "error"}
        sx={{ marginBottom: "2px" }}
    >
        {children}
    </Alert>
);

export default MonitStatusAlert;
