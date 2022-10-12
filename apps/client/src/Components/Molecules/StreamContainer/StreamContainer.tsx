import HomeremoteStreamPlayer from "@mdworld/homeremote-stream-player";
import { FC, useCallback, useEffect } from "react";
import StyledStreamPlayer from "./StyledStreamPlayer";

const StreamContainer: FC = () => {
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
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyPress);

        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [handleKeyPress]);

    return (
        <StyledStreamPlayer>
            <HomeremoteStreamPlayer url={process.env.NX_BASE_URL || ""} />
        </StyledStreamPlayer>
    );
};

export default StreamContainer;
