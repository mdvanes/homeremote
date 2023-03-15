import { Cancel as CancelIcon, Link as LinkIcon } from "@mui/icons-material";
import {
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Tooltip,
} from "@mui/material";
import { FC } from "react";

interface TokenFormProps {
    connectedTokenVal: string;
    setConnectedTokenVal: (val: string) => void;
    energyTokenVal: string;
    setEnergyTokenVal: (val: string) => void;
    handleEnterSubmit: (ev: React.KeyboardEvent<HTMLDivElement>) => void;
}

export const TokenForm: FC<TokenFormProps> = ({
    connectedTokenVal,
    setConnectedTokenVal,
    energyTokenVal,
    setEnergyTokenVal,
    handleEnterSubmit,
}) => {
    return (
        <Grid container gap={2} alignItems="baseline">
            <TextField
                label="Connected Vehicle Token"
                value={connectedTokenVal}
                variant="standard"
                onChange={(ev) => {
                    setConnectedTokenVal(ev.target.value);
                }}
                onKeyDown={handleEnterSubmit}
                InputProps={{
                    endAdornment: (
                        <InputAdornment
                            position="end"
                            onClick={() => {
                                setConnectedTokenVal("");
                            }}
                        >
                            <CancelIcon />
                        </InputAdornment>
                    ),
                }}
            />
            <TextField
                label="Energy Token"
                value={energyTokenVal}
                variant="standard"
                onChange={(ev) => {
                    setEnergyTokenVal(ev.target.value);
                }}
                onKeyDown={handleEnterSubmit}
                InputProps={{
                    endAdornment: (
                        <InputAdornment
                            position="end"
                            onClick={() => {
                                setEnergyTokenVal("");
                            }}
                        >
                            <CancelIcon />
                        </InputAdornment>
                    ),
                }}
            />
            <Tooltip title="open link to API in new tab">
                <a
                    style={{ color: "white" }}
                    href="https://developer.volvocars.com/apis/docs/test-access-tokens/"
                >
                    <LinkIcon />
                </a>
            </Tooltip>
            <IconButton
                onClick={() => {
                    setConnectedTokenVal("");
                    setEnergyTokenVal("");
                }}
            >
                <CancelIcon />
            </IconButton>
        </Grid>
    );
};
