import {
    Close as CloseIcon,
    Download as DownloadIcon,
    FormatQuote as FormatQuoteIcon,
    Info as InfoIcon,
    Search as SearchIcon,
} from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    Grid,
    IconButton,
    InputAdornment,
    LinearProgress,
    List,
    ListItemButton,
    ListItemText,
    Stack,
    TextField,
    Tooltip,
    Typography,
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

    const isBusy =
        isSearching || isInfoFetching || isMusicFetching || isPolling;
    const statusError = infoError || musicError || progressError;

    return (
        <Stack spacing={1.5}>
            {/* Top-anchored progress, reserves height so it never shifts content */}
            <Box sx={{ height: 4 }}>{isBusy && <LinearProgress />}</Box>

            {/* Search: single compact row with inline action buttons */}
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
                    size="small"
                    value={terms}
                    variant="standard"
                    onChange={(ev) => setTerms(ev.target.value)}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title="search">
                                        <IconButton
                                            type="submit"
                                            aria-label="search"
                                            size="small"
                                            color="primary"
                                        >
                                            <SearchIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="prefill from now playing">
                                        <IconButton
                                            aria-label="prefill"
                                            size="small"
                                            color="primary"
                                            onClick={handlePrefill}
                                        >
                                            <FormatQuoteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="reset">
                                        <IconButton
                                            aria-label="reset"
                                            size="small"
                                            color="warning"
                                            onClick={handleReset}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            </Box>

            {searchQuery && searchResult?.searchResults && (
                <List
                    dense
                    sx={{
                        maxHeight: 160,
                        overflow: "auto",
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 1,
                        py: 0,
                    }}
                >
                    {searchResult.searchResults.map((item, index) => (
                        <ListItemButton
                            key={index}
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
            )}

            {/* Music form: two columns (fields left, compact preview right) */}
            <FormContainer formContext={formContext} onSuccess={handleGetMusic}>
                <Grid container spacing={2} sx={{ alignItems: "flex-start" }}>
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Stack spacing={1}>
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{ alignItems: "flex-end" }}
                            >
                                <TextFieldElement
                                    name="url"
                                    label="URL"
                                    fullWidth
                                    size="small"
                                    variant="standard"
                                    slotProps={{
                                        htmlInput: { "data-testid": "url" },
                                    }}
                                />
                                <Button
                                    data-testid="get-info"
                                    color="primary"
                                    size="small"
                                    startIcon={<InfoIcon />}
                                    onClick={handleGetInfo}
                                    sx={{ flexShrink: 0 }}
                                >
                                    Get Info
                                </Button>
                            </Stack>
                            <Grid container spacing={1}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextFieldElement
                                        name="title"
                                        label="Title"
                                        fullWidth
                                        size="small"
                                        variant="standard"
                                        disabled={!showMusicFields}
                                        slotProps={{
                                            htmlInput: {
                                                "data-testid": "title",
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextFieldElement
                                        name="artist"
                                        label="Artist"
                                        fullWidth
                                        size="small"
                                        variant="standard"
                                        disabled={!showMusicFields}
                                        slotProps={{
                                            htmlInput: {
                                                "data-testid": "artist",
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <TextFieldElement
                                name="album"
                                label="Album"
                                fullWidth
                                size="small"
                                variant="standard"
                                disabled={!showMusicFields}
                            />
                        </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Box
                            sx={{
                                aspectRatio: "16 / 9",
                                maxHeight: 180,
                                width: "100%",
                                borderRadius: 1,
                                overflow: "hidden",
                                bgcolor: "action.hover",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {url ? (
                                <ReactPlayer
                                    width="100%"
                                    height="100%"
                                    url={url}
                                />
                            ) : (
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Preview appears here
                                </Typography>
                            )}
                        </Box>
                    </Grid>
                </Grid>

                {/* Reserved status area so alerts swap in place without jumping */}
                <Box sx={{ minHeight: 48, mt: 1 }}>
                    {statusError && (
                        <Alert severity="error">
                            {getErrorMessage(statusError)}
                        </Alert>
                    )}
                    {!statusError && resultPath && (
                        <Alert severity="success">Result in {resultPath}</Alert>
                    )}
                </Box>

                {/* Sticky action bar keeps the primary action reachable */}
                <Box
                    sx={{
                        position: "sticky",
                        bottom: 0,
                        borderTop: 1,
                        borderColor: "divider",
                        pt: 1,
                        mt: 1,
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <Button
                        data-testid="get-music"
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={<DownloadIcon />}
                        disabled={
                            !showMusicFields || isMusicFetching || isPolling
                        }
                    >
                        Get Music
                    </Button>
                </Box>
            </FormContainer>
        </Stack>
    );
};

export default UrlToMusicForm;
