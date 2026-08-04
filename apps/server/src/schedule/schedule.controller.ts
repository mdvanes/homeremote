import {
    GetScheduleResponse,
    MovieApiCalendarItem,
    MovieApiCalendarResponse,
    MovieScheduleItem,
    ScheduleItem,
    TvShowApiCalendarResponse,
    TvShowApiEpisode,
    TvShowScheduleItem,
} from "@homeremote/types";
import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    Param,
    Request,
    StreamableFile,
    UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import got from "got";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import type { AuthenticatedRequest } from "../login/LoginRequest.types";

const DAYS_BEFORE = 3;
const DAYS_AFTER = 7;

const toDateString = (date: Date): string => date.toISOString().slice(0, 10);

export const getScheduleDateRange = (
    now: Date = new Date()
): { start: string; end: string } => {
    const start = new Date(now);
    start.setDate(start.getDate() - DAYS_BEFORE);
    const end = new Date(now);
    end.setDate(end.getDate() + DAYS_AFTER);
    return { start: toDateString(start), end: toDateString(end) };
};

const mapTvShowEpisode = (episode: TvShowApiEpisode): TvShowScheduleItem => {
    const poster = episode.series?.images?.find(
        (image) => image.coverType === "poster"
    );
    return {
        id: `tvshow-${episode.id}`,
        kind: "tvshow",
        date: episode.airDate ?? "",
        title: episode.series?.title ?? "",
        posterUrl: poster
            ? `/api/schedule/thumbnail/tvshow/${episode.seriesId}`
            : null,
        monitored: episode.monitored ?? false,
        hasFile: episode.hasFile ?? false,
        seasonNumber: episode.seasonNumber,
        episodeNumber: episode.episodeNumber,
        episodeTitle: episode.title,
    };
};

const mapMovieItem = (movie: MovieApiCalendarItem): MovieScheduleItem => {
    const poster = movie.images?.find((image) => image.coverType === "poster");
    return {
        id: `movie-${movie.id}`,
        kind: "movie",
        date:
            movie.digitalRelease ??
            movie.physicalRelease ??
            movie.inCinemas ??
            "",
        title: movie.title,
        posterUrl: poster ? `/api/schedule/thumbnail/movie/${movie.id}` : null,
        monitored: movie.monitored ?? false,
        hasFile: movie.hasFile ?? false,
    };
};

@Controller("api/schedule")
export class ScheduleController {
    private readonly logger: Logger;
    private readonly tvShowBaseUrl: string;
    private readonly tvShowApiKey: string;
    private readonly movieBaseUrl: string;
    private readonly movieApiKey: string;

    constructor(private configService: ConfigService) {
        this.logger = new Logger(ScheduleController.name);
        this.tvShowBaseUrl =
            this.configService.get<string>("TVSHOW_BASE_URL") || "";
        this.tvShowApiKey =
            this.configService.get<string>("TVSHOW_API_KEY") || "";
        this.movieBaseUrl =
            this.configService.get<string>("MOVIE_BASE_URL") || "";
        this.movieApiKey =
            this.configService.get<string>("MOVIE_API_KEY") || "";
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getSchedule(
        @Request() req: AuthenticatedRequest
    ): Promise<GetScheduleResponse> {
        this.logger.verbose(`[${req.user.name}] GET to /api/schedule`);
        const { start, end } = getScheduleDateRange();

        try {
            const [tvShowEpisodes, movieItems] = await Promise.all([
                got(`${this.tvShowBaseUrl}/api/v3/calendar`, {
                    headers: { "X-Api-Key": this.tvShowApiKey },
                    searchParams: { start, end, includeSeries: true },
                }).json<TvShowApiCalendarResponse>(),
                got(`${this.movieBaseUrl}/api/v3/calendar`, {
                    headers: { "X-Api-Key": this.movieApiKey },
                    searchParams: { start, end },
                }).json<MovieApiCalendarResponse>(),
            ]);

            const items: ScheduleItem[] = [
                ...tvShowEpisodes.map(mapTvShowEpisode),
                ...movieItems.map(mapMovieItem),
            ].sort((a, b) => a.date.localeCompare(b.date));

            return { items };
        } catch (err) {
            this.logger.error(`[${req.user.name}] ${err}`);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("thumbnail/:kind/:id")
    async getThumbnail(
        @Param("kind") kind: "tvshow" | "movie",
        @Param("id") id: string,
        @Request() req: AuthenticatedRequest
    ): Promise<StreamableFile> {
        this.logger.verbose(
            `[${req.user.name}] GET to /api/schedule/thumbnail/${kind}/${id}`
        );
        try {
            const streamUrl =
                kind === "tvshow"
                    ? `${this.tvShowBaseUrl}/api/v3/mediacover/series/${id}/poster.jpg`
                    : `${this.movieBaseUrl}/api/v3/mediacover/${id}/poster.jpg`;
            const apiKey =
                kind === "tvshow" ? this.tvShowApiKey : this.movieApiKey;
            const str = got.stream(streamUrl, {
                headers: { "X-Api-Key": apiKey },
            });
            return new StreamableFile(str);
        } catch (err) {
            this.logger.error(`[${req.user.name}] ${err}`);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
