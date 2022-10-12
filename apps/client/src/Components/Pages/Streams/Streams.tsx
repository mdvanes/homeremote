import React, { FC } from "react";
import HomeremoteStreamPlayer from "@mdworld/homeremote-stream-player";
import { styled } from "@mui/material/styles";
import { Container, lighten } from "@mui/system";

const StreamContainer = styled(Container)(
    ({ theme }) => `
    padding: 0 !important;
    font-family: 'Roboto';
    max-width: 800px;
    color1: black;
    
    .card {
        background-color: ${lighten(theme.palette.background.paper, 4 * 0.025)};
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

    .card .title {
        margin-right: 1rem;
    }

`
);

const Streams: FC = () => (
    <StreamContainer>
        <HomeremoteStreamPlayer url={process.env.NX_BASE_URL || ""} />
    </StreamContainer>
);

export default Streams;
