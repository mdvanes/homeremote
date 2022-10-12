import React, { FC, useCallback, useEffect } from "react";
import HomeremoteStreamPlayer from "@mdworld/homeremote-stream-player";
import { styled } from "@mui/material/styles";
import { Container, lighten } from "@mui/system";

const StreamContainer = styled(Container)(
    ({ theme }) => `
    padding: 0 !important;
    font-family: 'Roboto';
    max-width: 800px;
    
    .card {
        background-color: ${lighten(theme.palette.background.paper, 2 * 0.025)};
    }

    .card .channel {
        flex-direction: column;
        align-items: flex-start;
    }

    .card .channel select {
        color: ${theme.palette.primary.main};
        border-bottom-color: ${theme.palette.primary.main};
    }

    .card .channel .channel-info {
        color: ${theme.palette.text.primary};
        max-height: 3rem;
    }

    .card .controls > .play {
        fill: ${theme.palette.text.primary};

        &:hover, &:hover.active {
            fill: ${theme.palette.primary.light};
        }

        &.active {
            fill: ${theme.palette.primary.main};
        }
    }

    .card .artist, .card .title {
        display: inline;
    }

    .card .artist {
        color: ${theme.palette.primary.main};
    }

    .card .title {
        font-size: 100%;
        margin-right: 0.5rem;
    }
`
);

const Streams: FC = () => {
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
        <StreamContainer>
            <HomeremoteStreamPlayer url={process.env.NX_BASE_URL || ""} />
        </StreamContainer>
    );
};

export default Streams;
