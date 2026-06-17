import {
    Close as CloseIcon,
    Download as DownloadIcon,
    FormatQuote as FormatQuoteIcon,
    Info as InfoIcon,
    MusicNote as MusicNoteIcon,
    Search as SearchIcon,
} from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    InputAdornment,
    LinearProgress,
    List,
    ListItemButton,
    ListItemText,
    Stack,
    TextField,
} from "@mui/material";
import { skipToken } from "@reduxjs/toolkit/query";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import ReactPlayer from "react-player";
import { useDispatch } from "react-redux";
import {
    GetMusicApiArg,
    useGetInfoQuery,
    useGetMusicProgressQuery,
    useGetMusicQuery,
    useGetSearchQuery,
} from "../../../Services/generated/urlToMusicApi";
import { getErrorMessage } from "../../../Utils/getErrorMessage";
import { logError } from "../LogCard/logSlice";
import { UrlToMusicFormValues, urlToMusicResolver } from "./validation";

const UPDATE_INTERVAL_MS = 5 * 1000;

const UrlToMusicForm: FC = () => {
    const dispatch = useDispatch();
    const year = new Date().getFullYear();

    const formContext = useForm<UrlToMusicFormValues>({
        resolver: urlToMusicResolver,
        defaultValues: {
            url: "",
            title: "",
            artist: "",
            album: `Songs from ${year}`,
        },
    });
    const { watch, setValue, trigger } = formContext;
    const url = watch("url");

    // --- Search ---
    const [terms, setTerms] = useState("");
    const [searchQuery, setSearchQuery] = useState<string | undefined>();
    const {
        data: searchResult,
        isFetching: isSearching,
        error: searchError,
    } = useGetSearchQuery(searchQuery ? { terms: searchQuery } : skipToken);

    const handlePrefill = async () => {
        try {
            const nowplaying: { artist: string; title: string } = await fetch(
                `${process.env.NX_PUBLIC_BASE_URL}/api/nowplaying/radio2`
            ).then((data) => data.json());
            setTerms(`${nowplaying.artist} ${nowplaying.title}`);
        } catch (err) {
            dispatch(logError(`UrlToMusic prefill failure: ${err}`));
        }
    };

    // --- Get info ---
    const [infoUrl, setInfoUrl] = useState<string | undefined>();
    const {
        data: infoData,
        isFetching: isInfoFetching,
        error: infoError,
        refetch: refetchInfo,
    } = useGetInfoQuery(infoUrl ? { url: infoUrl } : skipToken);
    const [showMusicFields, setShowMusicFields] = useState(false);

    useEffect(() => {
        if (infoData) {
            setValue("title", infoData.title);
            setValue("artist", infoData.artist);
            setShowMusicFields(true);
        }
    }, [infoData, setValue]);

    const handleGetInfo = async () => {
        const isValid = await trigger("url");
        if (!isValid) {
            return;
        }
        setInfoUrl(encodeURIComponent(url));
        try {
            refetchInfo();
        } catch {
            // ignore error when refetching on the first query
        }
    };

    // --- Get music + progress ---
    const [musicArgs, setMusicArgs] = useState<GetMusicApiArg>();
    const {
        refetch: refetchMusic,
        isFetching: isMusicFetching,
        error: musicError,
    } = useGetMusicQuery(musicArgs ?? skipToken);

    const [isPolling, setIsPolling] = useState(false);
    const [resultPath, setResultPath] = useState<string | false>(false);
    const { data: progressData, error: progressError } =
        useGetMusicProgressQuery(
            isPolling && url ? { url: encodeURIComponent(url) } : skipToken,
            { pollingInterval: UPDATE_INTERVAL_MS }
        );

    useEffect(() => {
        if (progressData?.state === "finished") {
            setIsPolling(false);
            setResultPath(progressData.path ?? false);
        }
    }, [progressData]);

    const handleGetMusic = (values: UrlToMusicFormValues) => {
        setResultPath(false);
        setMusicArgs({
            url: encodeURIComponent(values.url),
            title: values.title,
            artist: values.artist,
            album: values.album,
        });
        setIsPolling(true);
        try {
            refetchMusic();
        } catch {
            // ignore error when refetching on the first query
        }
    };

    // --- Error logging ---
    useEffect(() => {
        const error = searchError || infoError || musicError || progressError;
        if (error) {
            dispatch(logError(`UrlToMusic failure: ${getErrorMessage(error)}`));
            if (progressError || musicError) {
                setIsPolling(false);
            }
        }
    }, [searchError, infoError, musicError, progressError, dispatch]);

    const handleReset = () => {
        setTerms("");
        setSearchQuery(undefined);
        setInfoUrl(undefined);
        setMusicArgs(undefined);
        setIsPolling(false);
        setResultPath(false);
        setShowMusicFields(false);
        formContext.reset();
    };

    const isDownloading = isMusicFetching || isPolling;

    return (
        <Stack spacing={2}>
            {/* Search */}
            <Box
                component="form"
                onSubmit={(ev) => {
                    ev.preventDefault();
                    setSearchQuery(terms);
                }}
            >
                <TextField
                    data-testid="terms"
                    label="Search terms"
                    name="terms"
                    fullWidth
                    value={terms}
                    variant="standard"
                    onChange={(ev) => setTerms(ev.target.value)}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <MusicNoteIcon />
                                </InputAdornment>
                            ),
                        },
                    }}
                />
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Button
                        type="submit"
                        startIcon={<SearchIcon />}
                        color="primary"
                    >
                        search
                    </Button>
                    <Button
                        startIcon={<FormatQuoteIcon />}
                        color="primary"
                        onClick={handlePrefill}
                    >
                        prefill
                    </Button>
                    <Button
                        startIcon={<CloseIcon />}
                        color="warning"
                        onClick={handleReset}
                    >
                        reset
                    </Button>
                </Stack>
            </Box>

            {searchError && (
                <Alert severity="error">{getErrorMessage(searchError)}</Alert>
            )}
            {isSearching ? (
                <CircularProgress />
            ) : (
                searchQuery &&
                searchResult?.searchResults && (
                    <List dense>
                        {searchResult.searchResults.map((item, index) => (
                            <ListItemButton
                                key={index}
                                sx={{ gap: 2 }}
                                onClick={() =>
                                    setValue(
                                        "url",
                                        `https://youtube.com/watch?v=${item.id}`
                                    )
                                }
                            >
                                <ListItemText primary={item.title} />
                            </ListItemButton>
                        ))}
                    </List>
                )
            )}

            {/* Music form */}
            <FormContainer formContext={formContext} onSuccess={handleGetMusic}>
                <Stack spacing={1}>
                    <TextFieldElement
                        name="url"
                        label="URL"
                        fullWidth
                        variant="standard"
                        slotProps={{ htmlInput: { "data-testid": "url" } }}
                    />
                    <Box>
                        <Button
                            data-testid="get-info"
                            color="primary"
                            startIcon={<InfoIcon />}
                            onClick={handleGetInfo}
                        >
                            Get Info
                        </Button>
                    </Box>

                    {infoError && (
                        <Alert severity="error">
                            {getErrorMessage(infoError)}
                        </Alert>
                    )}
                    {url && (
                        <ReactPlayer
                            style={{
                                aspectRatio: "16/9",
                                maxWidth: "1100px",
                            }}
                            height="auto"
                            width="100%"
                            url={url}
                        />
                    )}
                    {isInfoFetching && <CircularProgress />}

                    {showMusicFields && (
                        <>
                            <TextFieldElement
                                name="title"
                                label="Title"
                                fullWidth
                                variant="standard"
                                slotProps={{
                                    htmlInput: { "data-testid": "title" },
                                }}
                            />
                            <TextFieldElement
                                name="artist"
                                label="Artist"
                                fullWidth
                                variant="standard"
                                slotProps={{
                                    htmlInput: { "data-testid": "artist" },
                                }}
                            />
                            <TextFieldElement
                                name="album"
                                label="Album"
                                fullWidth
                                variant="standard"
                            />
                            <Box>
                                <Button
                                    data-testid="get-music"
                                    type="submit"
                                    color="primary"
                                    startIcon={<DownloadIcon />}
                                >
                                    Get Music
                                </Button>
                            </Box>
                        </>
                    )}

                    {musicError && (
                        <Alert severity="error">
                            {getErrorMessage(musicError)}
                        </Alert>
                    )}
                    {progressError && (
                        <Alert severity="error">
                            {getErrorMessage(progressError)}
                        </Alert>
                    )}
                    {isDownloading && <LinearProgress />}
                    {resultPath && (
                        <Alert severity="success">Result in {resultPath}</Alert>
                    )}
                </Stack>
            </FormContainer>
        </Stack>
    );
};

export default UrlToMusicForm;
