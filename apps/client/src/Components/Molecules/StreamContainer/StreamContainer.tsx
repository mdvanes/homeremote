import HomeremoteStreamPlayer from "@mdworld/homeremote-stream-player";
import { FC } from "react";
import { useHotKeyContext } from "../../Providers/HotKey/HotKeyProvider";
import StyledStreamPlayer from "./StyledStreamPlayer";

const StreamContainer: FC = () => {
    const { setPorts } = useHotKeyContext();

    return (
        <StyledStreamPlayer>
            <HomeremoteStreamPlayer
                url={process.env.NX_BASE_URL || ""}
                setPorts={setPorts}
            />
        </StyledStreamPlayer>
    );
};

export default StreamContainer;
