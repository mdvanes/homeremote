import {
    SearchResultItem,
    UrlToMusicGetInfoResponse,
    UrlToMusicGetMusicArgs,
    UrlToMusicGetMusicProgressResponse,
    UrlToMusicGetMusicResponse,
    UrlToMusicGetSearchResponse,
    UrlToMusicSetMetadataArgs,
    UrlToMusicSetMetadataResponse,
    UrlToMusicState,
    UrlToMusicYdlExecArgs,
} from "@homeremote/types";
import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    Param,
    Query,
    Request,
    UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { execFile } from "child_process";
import { chmodSync, chownSync } from "fs";
import got from "got";
import nodeID3 from "node-id3";
import youtubeDlExec, { YtFlags } from "youtube-dl-exec";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AuthenticatedRequest } from "../login/LoginRequest.types";

// This is an untyped but exported object from youtube-dl-exec
// eslint-disable-next-line @typescript-eslint/no-var-requires
const youtubeDlConstants = require("youtube-dl-exec/src/constants");

const NR_OF_SEARCH_RESULTS = 10;

const getArtistTitle = (info: string) => {
    const td = ": Tiny Desk Concert";

    if (info.indexOf(td) > -1) {
        return [info.replace(td, ""), "TODO (Tiny Desk)"];
    }
    return info.split(" - ").map((str) => str.trim());
};

const ydlFlags: YtFlags = {
    noCheckCertificates: true,
    noWarnings: true,
    preferFreeFormats: true,
    addHeader: ["referer:youtube.com", "user-agent:googlebot"],
};

const getInfo = async (url: string): Promise<UrlToMusicGetInfoResponse> => {
    const info = await youtubeDlExec(url, {
        ...ydlFlags,
        dumpSingleJson: true,
    });

    const [artist, title] = getArtistTitle(info.title);

    return {
        artist,
        title,
        streamUrl: info.formats.map((f) => f.url),
        versionInfo: info["_version"].version,
    };
};

const searchByTerms = async (terms: string, nrOfResults: number) => {
    const searchResult = await youtubeDlExec(
        `ytsearch${nrOfResults}:${terms}`,
        {
            ...ydlFlags,
            dumpSingleJson: true,
            getId: true,
            getTitle: true,
            // TODO also get description? it's not built-in
        }
    );

    // NOTE: in this case the result type is a string, but this is not (yet) in the typings
    const searchLinesAll = (searchResult as unknown as string).split("\n");
    // For each search result, the first line is the title and the second line is the id
    const searchLines = searchLinesAll.slice(0, nrOfResults * 2);
    const searchResultNew = searchLines.reduce<SearchResultItem[]>(
        (acc, nextLine, index) => {
            if (index % 2 === 0) {
                return [
                    ...acc,
                    {
                        title: nextLine,
                    },
                ];
            } else {
                acc[acc.length - 1].id = nextLine;
                return acc;
            }
        },
        []
    );

    return searchResultNew;
};

const getLatestBinVersion = async (): Promise<string> => {
    const { YOUTUBE_DL_HOST, YOUTUBE_DL_FILE } = youtubeDlConstants;
    if (!YOUTUBE_DL_HOST || !YOUTUBE_DL_FILE) {
        throw Error("DL HOST constant not found");
    }
    const [{ tag_name }] = await got(YOUTUBE_DL_HOST).json<
        {
            tag_name: string;
        }[]
    >();
    return tag_name;
};

const ydlExec = async ({
    rootPath,
    url,
    artist,
    title,
}: UrlToMusicYdlExecArgs): Promise<UrlToMusicSetMetadataResponse> => {
    let fileName = encodeURIComponent(url);
    if (artist && artist.length > 0 && title && title.length > 0) {
        fileName = `${artist} - ${title}`;
    }
    const targetPath = `${rootPath}/${fileName}.mp3`;

    await youtubeDlExec(url, {
        ...ydlFlags,
        audioFormat: "mp3",
        audioQuality: 0,
        // NOTE: extractAudio requires ffmpeg
        extractAudio: true,
        output: targetPath,
    });

    return { path: targetPath, fileName };
};

const setMetadata = ({
    path,
    fileName,
    artist,
    title,
    album,
}: UrlToMusicSetMetadataArgs): UrlToMusicSetMetadataResponse => {
    const hasValidArgs =
        artist && artist.length > 0 && title && title.length > 0;
    if (!hasValidArgs) {
        throw new Error(
            `Set metadata failed, invalid args: ${path} [${artist}] [${title}]`
        );
    }
    const success = nodeID3.write({ artist, title, album }, path);
    if (success) {
        return { path, fileName };
    }
};

@Controller("api/urltomusic")
export class UrltomusicController {
    private readonly logger: Logger;
    private state: UrlToMusicState;
    private asyncException: HttpException;
    private result: UrlToMusicSetMetadataResponse | null;

    constructor(private configService: ConfigService) {
        this.logger = new Logger(UrltomusicController.name);
        this.state = "idle";
        this.result = null;
    }

    // Don't await to finish before returning status
    updateBin = () => {
        execFile(
            "node",
            ["node_modules/youtube-dl-exec/scripts/postinstall.js"],
            (error, stdout) => {
                if (error) {
                    this.logger.error(`failed updating bin ${error}`);
                }
                this.logger.verbose(`finished updating bin [${stdout}]`);
            }
        );
    };

    urlToFile = async ({
        url,
        artist,
        title,
        album,
    }: UrlToMusicGetMusicArgs): Promise<void> => {
        const rootPath = this.configService.get<string>(
            "URL_TO_MUSIC_ROOTPATH"
        );
        const uid = this.configService.get<string>("OWNERINFO_UID");
        const gid = this.configService.get<string>("OWNERINFO_GID");
        try {
            if (!rootPath) {
                throw new HttpException(
                    "rootPath not configured",
                    HttpStatus.NOT_ACCEPTABLE
                );
            }
            if (!uid) {
                throw new HttpException(
                    "OWNERINFO_UID not configured",
                    HttpStatus.NOT_ACCEPTABLE
                );
            }
            if (!gid) {
                throw new HttpException(
                    "OWNERINFO_GID not configured",
                    HttpStatus.NOT_ACCEPTABLE
                );
            }
        } catch (ex) {
            this.state = "error";
            this.asyncException = ex;
            return;
        }

        try {
            const { path, fileName } = await ydlExec({
                rootPath,
                url,
                artist,
                title,
            });
            this.logger.verbose(`Got music for ${url} to ${fileName}`);

            const result = setMetadata({
                path,
                fileName,
                artist,
                title,
                album,
            });
            this.logger.verbose(`Set metadata for ${fileName}`);
            chmodSync(result.path, "664");
            chownSync(result.path, parseInt(uid, 10), parseInt(gid, 10));
            this.logger.verbose(`Set owner permissions for ${result.path}`);
            this.state = "finished";
            this.result = result;
        } catch (err) {
            const message =
                err instanceof Error ? `${err.name} ${err.message}` : "";
            this.asyncException = new HttpException(
                message,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
            this.state = "error";
        }
    };

    @UseGuards(JwtAuthGuard)
    @Get("getinfo/:url")
    async getInfo(
        @Param("url") url: string
    ): Promise<UrlToMusicGetInfoResponse> {
        this.logger.verbose(`GET to /api/getinfo/${url}`);
        if (url) {
            try {
                const info = await getInfo(url);
                const latestBinVersion = await getLatestBinVersion();

                this.state = "downloading";

                this.logger.verbose(
                    `Current bin version: ${info.versionInfo} Latest bin version: ${latestBinVersion}`
                );
                if (info.versionInfo !== latestBinVersion) {
                    this.logger.verbose(`Update to latest bin version`);
                    this.updateBin();
                }
                return info;
            } catch (err) {
                this.logger.verbose("getInfo failed: " + err);
                this.updateBin();
                throw new HttpException(
                    "binary outdated or broken, trying to update",
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        } else {
            throw new HttpException(
                "url is required",
                HttpStatus.NOT_ACCEPTABLE
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("getmusic/:url")
    async getMusic(
        @Param("url") url: string,
        @Query("artist") artist: string,
        @Query("title") title: string,
        @Query("album") album: string
    ): Promise<UrlToMusicGetMusicResponse> {
        this.logger.verbose(
            `GET to /api/getmusic/${url}?artist=${artist}&title=${title}&album=${album}`
        );
        if (url && artist && title && album) {
            // Don't await to finish before returning status, but poll at getmusic/:url/progress
            this.urlToFile({ url, artist, title, album });

            return {
                url,
            };
        } else {
            // If params not set, the error "not acceptable" is shown in the UI instead of e.g. "url is required"
            throw new HttpException(
                "url, artist, title, and album are required",
                HttpStatus.NOT_ACCEPTABLE
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("getmusic/:url/progress")
    async getMusicProgress(
        @Param("url") url: string
    ): Promise<UrlToMusicGetMusicProgressResponse> {
        this.logger.verbose(`GET to /api/getmusic/${url}/progress`);

        if (this.state === "idle" || this.state === "downloading") {
            return {
                url,
                state: this.state,
            };
        }

        if (this.state === "error") {
            const message = this.asyncException;
            this.state = "idle";
            this.asyncException = null;
            throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const path = this.result.path;
        const state = this.state;
        this.state = "idle";
        this.result = null;
        return {
            url,
            state,
            path,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get("getsearch/:terms")
    async getSearch(
        @Param("terms") terms: string,
        @Request() req: AuthenticatedRequest
    ): Promise<UrlToMusicGetSearchResponse> {
        this.logger.verbose(`[${req.user.name}] GET to /api/search/${terms}`);
        if (terms) {
            try {
                const searchResults = await searchByTerms(
                    terms,
                    NR_OF_SEARCH_RESULTS
                );

                this.state = "downloading";

                return {
                    searchResults: searchResults,
                };
            } catch (err) {
                this.logger.verbose("getSearch failed: " + err);
                throw new HttpException(
                    "getSearch failed",
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        } else {
            throw new HttpException(
                "url is required",
                HttpStatus.NOT_ACCEPTABLE
            );
        }
    }
}
