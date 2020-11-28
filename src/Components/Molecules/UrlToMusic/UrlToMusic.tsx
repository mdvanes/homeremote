import React, { FC } from "react";
import {
    Button,
    Card,
    CardContent,
    TextField,
    LinearProgress,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Reducers";
import { logInfo } from "../LogCard/logSlice";
import {
    UrlToMusicState,
    getInfo,
    setFormField,
    setFormFieldError,
} from "./urlToMusicSlice";

const UrlToMusic: FC = () => {
    const dispatch = useDispatch();

    const {
        title,
        error: errorMessage,
        urlError,
        form,
        isLoading,
    } = useSelector<RootState, UrlToMusicState>(
        (state: RootState) => state.urlToMusic
    );

    const validateGetInfo = (): boolean => {
        if (form.url.value === "") {
            // TODO dispatch(setUrlError("Fill in this field"));
            dispatch(setFormFieldError(["url", "Fill in this field"]));
            return false;
        }
        return true;
    };

    // const title = useSelector<RootState, UrlToMusicState["title"]>(
    //     (state: RootState) => state.urlToMusic.title
    // );
    // TODO also handle isLoading
    // const errorMessage = useSelector<RootState, UrlToMusicState["error"]>(
    //     (state: RootState) => state.urlToMusic.error
    // );
    // TODO migrate all state to redux
    // const [url, setUrl] = React.useState("");
    const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // TODO dispatch(setUrlError(false));
        console.log(event.target.name);
        dispatch(setFormField([event.target.name, event.target.value]));
    };
    const dispatchGetInfo = () => {
        const isValid = validateGetInfo();
        if (isValid) {
            dispatch(getInfo());
        }
    };
    const year = new Date().getFullYear();
    const [musicData, setMusicData] = React.useState({
        title: { value: "", error: false },
        artist: { value: "", error: false },
        album: { value: `Songs from ${year}`, error: false },
    });
    const handleMusicDataChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setMusicData({
            ...musicData,
            [event.target.name]: {
                value: event.target.value,
                error: false,
            },
        });
    };
    const getMusic = () => {
        if (musicData.title.value === "") {
            setMusicData({
                ...musicData,
                title: {
                    value: musicData.title.value,
                    error: true,
                },
            });
        } else {
            dispatch(logInfo("NYI1" + JSON.stringify(musicData)));
        }
    };
    return (
        <Card className="card-dashboard-height">
            <CardContent>
                <form>
                    <TextField
                        label="URL"
                        name="url"
                        fullWidth={true}
                        value={form.url.value}
                        error={Boolean(form.url.error)}
                        helperText={
                            Boolean(form.url.error) ? form.url.error : false
                        }
                        onChange={handleUrlChange}
                    />
                    <Button color="primary" onClick={dispatchGetInfo}>
                        Get Info
                    </Button>
                </form>
                {/* TODO validate required */}
                <form>
                    <TextField
                        label="Title"
                        name="title"
                        fullWidth={true}
                        value={title}
                        error={musicData.title.error}
                        helperText={
                            musicData.title.error ? "Fill in this field" : false
                        }
                        onChange={handleMusicDataChange}
                    />
                    <TextField
                        label="Artist"
                        name="artist"
                        fullWidth={true}
                        value={musicData.artist.value}
                        error={musicData.artist.error}
                        helperText={
                            musicData.artist.error
                                ? "Fill in this field"
                                : false
                        }
                        onChange={handleMusicDataChange}
                    />
                    <TextField
                        label="Album"
                        name="album"
                        fullWidth={true}
                        value={musicData.album.value}
                        error={musicData.album.error}
                        helperText={
                            musicData.album.error ? "Fill in this field" : false
                        }
                        onChange={handleMusicDataChange}
                    />
                    <Button color="primary" onClick={getMusic}>
                        Get Music
                    </Button>
                </form>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                {isLoading && <LinearProgress />}
            </CardContent>
        </Card>
    );
};

export default UrlToMusic;
