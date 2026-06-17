import { superstructResolver } from "@hookform/resolvers/superstruct";
import { Infer, define, object } from "superstruct";
import { FILL_IN_THIS_FIELD } from "./constants";

const requiredString = () =>
    define<string>(
        "requiredString",
        (value) =>
            (typeof value === "string" && value.trim().length > 0) ||
            FILL_IN_THIS_FIELD
    );

export const urlToMusicSchema = object({
    url: requiredString(),
    title: requiredString(),
    artist: requiredString(),
    album: requiredString(),
});

export type UrlToMusicFormValues = Infer<typeof urlToMusicSchema>;

export const urlToMusicResolver = superstructResolver(urlToMusicSchema);
