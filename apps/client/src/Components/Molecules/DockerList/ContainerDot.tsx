import { DockerContainerInfo } from "@homeremote/types";
import { Box } from "@mui/material";
import { FC } from "react";

const ContainerDot: FC<{ info: DockerContainerInfo }> = ({ info }) => (
    <Box
        title={info.Names.join(",")}
        sx={{
            display: "inline-block",
            width: 8,
            height: 8,
            backgroundColor: "info.main",
            marginRight: 0.25,
            borderRadius: "50%",
        }}
    ></Box>
);

export default ContainerDot;
