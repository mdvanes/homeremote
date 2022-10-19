import { UrlToMusicGetInfoArgs } from "@homeremote/types";
import { Alert, Button, CircularProgress, TextField } from "@mui/material";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Reducers";
import { useGetInfoQuery } from "../../../Services/urlToMusicApi";
import { getErrorMessage } from "../../../Utils/getErrorMessage";
import { logError } from "../LogCard/logSlice";
import { FILL_IN_THIS_FIELD } from "./constants";
import {
    reset,
    setFormField,
    setFormFieldError,
    UrlToMusicState,
} from "./urlToMusicSlice";

const GetInfoForm: FC = () => {
    const dispatch = useDispatch();
    const [query, setQuery] = useState<string | undefined>();

    const { form } = useSelector<RootState, UrlToMusicState>(
        (state: RootState) => state.urlToMusic
    );
    const args: UrlToMusicGetInfoArgs | typeof skipToken = query
        ? { url: query }
        : skipToken;

    const { isFetching, isLoading, error, refetch } = useGetInfoQuery(args);

    const validateGetInfo = (): boolean => {
        if (form.url.value === "") {
            dispatch(setFormFieldError(["url", FILL_IN_THIS_FIELD]));
            return false;
        }
        return true;
    };

    const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setFormField([event.target.name, event.target.value]));
    };

    useEffect(() => {
        if (error) {
            dispatch(
                logError(`GetInfoForm failure: ${getErrorMessage(error)}`)
            );
        }
    }, [error, dispatch]);

    return (
        <>
            <form>
                <TextField
                    data-testid="url"
                    label="URL"
                    name="url"
                    fullWidth={true}
                    value={form.url.value}
                    error={Boolean(form.url.error)}
                    helperText={form.url.error}
                    variant="standard"
                    onChange={handleUrlChange}
                />
                <Button
                    data-testid="get-info"
                    color="primary"
                    onClick={() => {
                        const isValid = validateGetInfo();
                        if (isValid) {
                            dispatch(reset());
                            setQuery(encodeURIComponent(form.url.value));
                            // Always call refetch to ignore cache and overwrite the music info
                            refetch();
                        }
                    }}
                >
                    Get Info
                </Button>
            </form>
            {error && <Alert severity="error">{getErrorMessage(error)}</Alert>}
            {(isFetching || isLoading) && <CircularProgress />}
            {/* TODO show a sensible preview */}
            {/* {data?.streamUrl &&
                data.streamUrl.map((s) => (
                    <video width={400} controls src={s} />
                ))} */}
        </>
    );
};

export default GetInfoForm;
