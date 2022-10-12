import HomeremoteStreamPlayer from "@mdworld/homeremote-stream-player";
import { Box, Card, CardContent } from "@mui/material";
import { FC, useCallback, useEffect, useState } from "react";
import StyledStreamPlayer from "./StyledStreamPlayer";

const StreamContainer: FC = () => {
    const [play, setPlay] = useState(false);

    // handle what happens on key press
    const handleKeyPress = useCallback((event) => {
        if (event.key === "Control") {
            return;
        }
        if (event.ctrlKey) {
            console.log(`Key pressed: ctrl+${event.key}`);
        }
        // p for pause
        if (event.key === "t") {
            console.log("toggle radio v stream");
            setPlay((prev) => !prev);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyPress);

        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [handleKeyPress]);

    return (
        <>
            <StyledStreamPlayer>
                <HomeremoteStreamPlayer url={process.env.NX_BASE_URL || ""} />
            </StyledStreamPlayer>
            <Box marginTop={2} />
            <Card sx={{ height: 250 }}>
                <CardContent>{play ? "playing" : "stopped"}</CardContent>
            </Card>
        </>
    );
};

export default StreamContainer;
