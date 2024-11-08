import {
    UrlToMusicGetInfoArgs,
    UrlToMusicGetMusicArgs,
} from "@homeremote/types";
import {
    Alert,
    Button,
    CardActions,
    LinearProgress,
    TextField,
} from "@mui/material";
import { skipToken } from "@reduxjs/toolkit/query";
import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Reducers";
import {
    useGetMusicProgressQuery,
    useGetMusicQuery,
} from "../../../Services/urlToMusicApi";
import { getErrorMessage } from "../../../Utils/getErrorMessage";
import { logError } from "../LogCard/logSlice";
import { FILL_IN_THIS_FIELD } from "./constants";
import {
    UrlToMusicState,
    resetProgressLoading,
    setFormField,
    setFormFieldError,
} from "./urlToMusicSlice";

const UPDATE_INTERVAL_MS = 5 * 1000;

const GetMusicForm: FC = () => {
    const dispatch = useDispatch();
    const [query, setQuery] = useState<UrlToMusicGetMusicArgs>();

    const {
        form,
        isLoading: isProgressLoading,
        result,
    } = useSelector<RootState, UrlToMusicState>(
        (state: RootState) => state.urlToMusic
    );

    const args: UrlToMusicGetMusicArgs | typeof skipToken = query
        ? query
        : skipToken;
    const { refetch, isFetching, isLoading, error } = useGetMusicQuery(args);

    const progressArgs: UrlToMusicGetInfoArgs | typeof skipToken =
        isProgressLoading && form.url.value
            ? { url: encodeURIComponent(form.url.value) }
            : skipToken;
    const { error: progressError } = useGetMusicProgressQuery(progressArgs, {
        pollingInterval: UPDATE_INTERVAL_MS,
    });

    const handleMusicDataChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        dispatch(setFormField([event.target.name, event.target.value]));
    };

    const validateGetMusic = (): boolean => {
        const invalidFieldNames = Object.entries(form)
            .filter(([, formField]) => formField.value === "")
            .map(([fieldName]) => fieldName);
        invalidFieldNames.forEach((fieldName) => {
            dispatch(setFormFieldError([fieldName, FILL_IN_THIS_FIELD]));
        });
        return invalidFieldNames.length === 0;
    };

    useEffect(() => {
        if (error || progressError) {
            const msg1 = error ? getErrorMessage(error) : "";
            const msg2 = progressError ? getErrorMessage(progressError) : "";
            dispatch(logError(`GetMusicForm failure: ${msg1}${msg2}`));
            dispatch(resetProgressLoading());
        }
    }, [error, progressError, dispatch]);

    return (
        <form style={{ marginTop: 16 }}>
            <TextField
                data-testid="title"
                label="Title"
                name="title"
                fullWidth={true}
                value={form.title.value}
                error={Boolean(form.title.error)}
                helperText={form.title.error}
                variant="standard"
                onChange={handleMusicDataChange}
            />
            <TextField
                data-testid="artist"
                label="Artist"
                name="artist"
                fullWidth={true}
                value={form.artist.value}
                error={Boolean(form.artist.error)}
                helperText={form.artist.error}
                variant="standard"
                onChange={handleMusicDataChange}
            />
            <TextField
                label="Album"
                name="album"
                fullWidth={true}
                value={form.album.value}
                error={Boolean(form.album.error)}
                helperText={form.album.error}
                variant="standard"
                onChange={handleMusicDataChange}
            />
            <CardActions>
                <Button
                    data-testid="get-music"
                    color="primary"
                    onClick={() => {
                        const isValid = validateGetMusic();
                        if (isValid) {
                            setQuery({
                                url: encodeURIComponent(form.url.value),
                                title: encodeURIComponent(form.title.value),
                                artist: encodeURIComponent(form.artist.value),
                                album: encodeURIComponent(form.album.value),
                            });
                            // To force ignoring cached value
                            try {
                                refetch();
                            } catch (err) {
                                // ignore error when refetching on the first query
                            }
                        }
                    }}
                >
                    Get Music
                </Button>
            </CardActions>
            {!isLoading && !isFetching && (
                <>
                    {error && (
                        <Alert severity="error">{getErrorMessage(error)}</Alert>
                    )}
                </>
            )}
            {progressError && (
                <Alert severity="error">{getErrorMessage(progressError)}</Alert>
            )}
            {(isLoading || isFetching || isProgressLoading) && (
                <LinearProgress />
            )}
            {result && <Alert severity="success">Result in {result}</Alert>}
        </form>
    );
};

export default GetMusicForm;
