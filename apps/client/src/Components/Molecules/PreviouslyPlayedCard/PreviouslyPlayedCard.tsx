import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import {
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    useTheme,
} from "@mui/material";
import { FC, useState } from "react";
import { useGetRadio2PreviouslyQuery } from "../../../Services/nowplayingApi";
import LoadingDot from "../LoadingDot/LoadingDot";

// Update every 3 minutes
const UPDATE_INTERVAL_MS = 3 * 60 * 1000;

export const PreviouslyPlayedCard: FC = () => {
    const { palette } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const { data, isLoading, isFetching } = useGetRadio2PreviouslyQuery(
        undefined,
        {
            pollingInterval: UPDATE_INTERVAL_MS,
        }
    );

    return isOpen ? (
        <List
            component={Paper}
            sx={{
                gap: "5px",
                maxHeight: "400px",
                overflowY: "scroll",
                padding: isOpen ? "inherit" : 0,
                lineHeight: "3px",
            }}
        >
            <LoadingDot isLoading={isLoading || isFetching} />
            {data?.map((track) => {
                const primary = `${track.artist} - ${track.title}`;
                return (
                    <ListItem key={track.time?.start}>
                        <ListItemText
                            sx={{
                                backgroundImage: `url(${
                                    track?.songImageUrl ??
                                    track?.broadcast?.imageUrl
                                })`,
                                backgroundSize: "contain",
                                backgroundRepeat: "no-repeat",
                                backgroundPositionX: "right",
                            }}
                            primary={
                                track.listenUrl ? (
                                    <a
                                        style={{
                                            color: palette.text.primary,
                                        }}
                                        href={track.listenUrl}
                                    >
                                        {primary}
                                    </a>
                                ) : (
                                    primary
                                )
                            }
                            secondary={`${track.time?.start?.slice(11, 16)}: ${
                                track.broadcast?.title
                            } / ${track.broadcast?.presenters}`}
                        />
                    </ListItem>
                );
            })}
            <IconButton
                aria-label="up"
                size="small"
                onClick={() => setIsOpen(false)}
            >
                <ArrowDropUp />
            </IconButton>
        </List>
    ) : (
        <IconButton
            sx={{
                transform: "translateY(3px)",
                padding: 0,
                height: "5px",
                overflow: "hidden",
                position: "absolute",
            }}
            aria-label="up"
            size="small"
            onClick={() => setIsOpen(true)}
        >
            <ArrowDropDown />
        </IconButton>
    );
};

export default PreviouslyPlayedCard;
