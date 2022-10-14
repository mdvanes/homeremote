import { styled } from "@mui/material/styles";
import { Container, lighten } from "@mui/system";

const StyledStreamPlayer = styled(Container)(
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

export default StyledStreamPlayer;
