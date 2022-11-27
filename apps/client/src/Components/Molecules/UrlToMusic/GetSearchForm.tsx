import { UrlToMusicGetSearchArgs } from "@homeremote/types";
import { Close as CloseIcon, Search as SearchIcon } from "@mui/icons-material";
import {
    Button,
    CardActions,
    CircularProgress,
    List,
    ListItemButton,
    ListItemText,
    TextField,
} from "@mui/material";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { useGetSearchQuery } from "../../../Services/urlToMusicApi";
import { resetAll, setFormField } from "./urlToMusicSlice";

const GetSearchForm: FC = () => {
    const dispatch = useDispatch();
    const [terms, setTerms] = useState<string>();
    const [query, setQuery] = useState<string>();

    const handleTermsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTerms(event.target.value);
    };

    const args: UrlToMusicGetSearchArgs | typeof skipToken = query
        ? { terms: query }
        : skipToken;
    const { data: result, isLoading, isFetching } = useGetSearchQuery(args);

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
                    {/* <ReactPlayer
                        style={{
                            aspectRatio: "16/9",
                        }}
                        width="auto"
                        // TODO height="auto"
                        height={100}
                        url={`https://youtube.com/watch?v=${item.id}`}
                    /> */}
                    <ListItemText primary={item.title} />
                </ListItemButton>
            ))}
        </List>
    ) : null;

    // TODO handle error?

    return (
        <form>
            <TextField
                data-testid="terms"
                label="Search terms"
                name="terms"
                fullWidth={true}
                value={terms}
                variant="standard"
                onChange={handleTermsChange}
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
                    startIcon={<CloseIcon />}
                    color="warning"
                    onClick={() => {
                        setTerms("");
                        setQuery("");
                        dispatch(resetAll());
                    }}
                >
                    reset
                </Button>
            </CardActions>
        </form>
    );
};

export default GetSearchForm;
