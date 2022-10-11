import React, { FC } from "react";
import {
    Button,
    Card,
    CardContent,
    TextField,
    LinearProgress,
} from "@mui/material";
import Alert from "@material-ui/lab/Alert";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Reducers";
import {
    UrlToMusicState,
    getInfo,
    setFormField,
    setFormFieldError,
    getMusic,
} from "./urlToMusicSlice";

const FILL_IN_THIS_FIELD = "Fill in this field";

const UrlToMusic: FC = () => {
    const dispatch = useDispatch();

    const {
        error: errorMessage,
        form,
        isLoading,
        result,
    } = useSelector<RootState, UrlToMusicState>(
        (state: RootState) => state.urlToMusic
    );

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

    const dispatchGetInfo = () => {
        const isValid = validateGetInfo();
        if (isValid) {
            dispatch(getInfo());
        }
    };

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

    const dispatchGetMusic = () => {
        const isValid = validateGetMusic();
        if (isValid) {
            dispatch(getMusic());
        }
    };

    return (
        <Card className="card-dashboard-height">
            <CardContent>
                <form>
                    <TextField
                        data-testid="url"
                        label="URL"
                        name="url"
                        fullWidth={true}
                        value={form.url.value}
                        error={Boolean(form.url.error)}
                        helperText={form.url.error}
                        onChange={handleUrlChange}
                    />
                    <Button
                        data-testid="get-info"
                        color="primary"
                        onClick={dispatchGetInfo}
                    >
                        Get Info
                    </Button>
                </form>
                <form>
                    <TextField
                        data-testid="title"
                        label="Title"
                        name="title"
                        fullWidth={true}
                        value={form.title.value}
                        error={Boolean(form.title.error)}
                        helperText={form.title.error}
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
                        onChange={handleMusicDataChange}
                    />
                    <TextField
                        label="Album"
                        name="album"
                        fullWidth={true}
                        value={form.album.value}
                        error={Boolean(form.album.error)}
                        helperText={form.album.error}
                        onChange={handleMusicDataChange}
                    />
                    <Button
                        data-testid="get-music"
                        color="primary"
                        onClick={dispatchGetMusic}
                    >
                        Get Music
                    </Button>
                </form>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                {result && <Alert severity="success">Result in {result}</Alert>}
                {isLoading && <LinearProgress />}
            </CardContent>
        </Card>
    );
};

export default UrlToMusic;
