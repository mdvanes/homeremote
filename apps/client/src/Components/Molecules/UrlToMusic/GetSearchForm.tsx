import { UrlToMusicGetSearchArgs } from "@homeremote/types";
import {
    Close as CloseIcon,
    FormatQuote as FormatQuoteIcon,
    MusicNote as MusicNoteIcon,
    Search as SearchIcon,
} from "@mui/icons-material";
import {
    Alert,
    Button,
    CardActions,
    CircularProgress,
    InputAdornment,
    List,
    ListItemButton,
    ListItemText,
    TextField,
} from "@mui/material";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
    urlToMusicApi,
    useGetSearchQuery,
} from "../../../Services/urlToMusicApi";
import { getErrorMessage } from "../../../Utils/getErrorMessage";
import { logError } from "../LogCard/logSlice";
import { resetAll, setFormField } from "./urlToMusicSlice";

const GetSearchForm: FC = () => {
    const dispatch = useDispatch();
    const [terms, setTerms] = useState<string>();
    const [query, setQuery] = useState<string>();

    const handleTermsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTerms(event.target.value);
    };

    const handlePrefill = async () => {
        const nowplaying: { artist: string; title: string } = await fetch(
            `${process.env.NX_BASE_URL}/api/nowplaying/radio2`
        ).then((data) => data.json());
        const newTerm = `${nowplaying.artist} ${nowplaying.title}`;
        setTerms(newTerm);
    };

    const args: UrlToMusicGetSearchArgs | typeof skipToken = query
        ? { terms: query }
        : skipToken;
    const {
        data: result,
        isLoading,
        isFetching,
        error,
    } = useGetSearchQuery(args);

    const resultElems = result?.searchResults ? (
        <List dense>
            {result.searchResults.map((item, index) => (
                <ListItemButton
                    key={index}
                    sx={{ gap: 2 }}
                    onClick={() => {
                        dispatch(
                            setFormField([
                                "url",
                                `https://youtube.com/watch?v=${item.id}`,
                            ])
                        );
                    }}
                >
                    <ListItemText primary={item.title} />
                </ListItemButton>
            ))}
        </List>
    ) : null;

    useEffect(() => {
        if (error) {
            dispatch(
                logError(
                    `GetSearchForm failure: ${getErrorMessage(
                        error
                    ).toString()}`
                )
            );
        }
    }, [dispatch, error]);

    if (error) {
        return <Alert severity="error">{getErrorMessage(error)}</Alert>;
    }

    return (
        <form
            onSubmit={(ev) => {
                ev.preventDefault();
                setQuery(terms);
            }}
        >
            <TextField
                data-testid="terms"
                label="Search terms"
                name="terms"
                fullWidth={true}
                // preventing undefined will prevent overlapping the label with the input
                value={terms ?? ""}
                variant="standard"
                onChange={handleTermsChange}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <MusicNoteIcon />
                        </InputAdornment>
                    ),
                }}
            />
            {isLoading || isFetching ? (
                <CircularProgress sx={{ marginTop: 2 }} />
            ) : (
                resultElems
            )}
            <CardActions>
                <Button
                    startIcon={<SearchIcon />}
                    color="primary"
                    onClick={() => {
                        setQuery(terms);
                    }}
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
                    onClick={() => {
                        setTerms("");
                        setQuery("");
                        dispatch(resetAll());
                        urlToMusicApi.util.resetApiState();
                    }}
                >
                    reset
                </Button>
            </CardActions>
        </form>
    );
};

export default GetSearchForm;
