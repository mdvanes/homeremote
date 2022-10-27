import { Box, LinearProgress } from "@mui/material";
import { FC } from "react";

const LoadingDot: FC = () => (
    <Box sx={{ position: "absolute" }}>
        <LinearProgress variant="indeterminate" style={{ width: 4 }} />
    </Box>
);

export default LoadingDot;
