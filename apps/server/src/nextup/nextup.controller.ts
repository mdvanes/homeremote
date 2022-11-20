import {
    GetNextUpResponse,
    ShowNextUpResponse,
    UserLatestResponse,
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
    StreamableFile,
    UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import got from "got";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AuthenticatedRequest } from "../login/LoginRequest.types";
import { isDefined } from "../util/isDefined";

@Controller("api/nextup")
export class NextupController {
    private readonly logger: Logger;
    private readonly apiConfig: {
        NEXTUP_URL: string;
        NEXTUP_API_TOKEN: string;
        NEXTUP_USER_ID: string;
    };

    constructor(private configService: ConfigService) {
        this.logger = new Logger(NextupController.name);
        const NEXTUP_URL = this.configService.get<string>("NEXTUP_URL") || "";
        // Create an API token in the Admin dashboard
        const NEXTUP_API_TOKEN =
            this.configService.get<string>("NEXTUP_API_TOKEN") || "";
        const NEXTUP_USER_ID =
            this.configService.get<string>("NEXTUP_USER_ID") || "";
        this.apiConfig = {
            NEXTUP_URL,
            NEXTUP_USER_ID,
            NEXTUP_API_TOKEN,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getNextUp(
        @Request() req: AuthenticatedRequest
    ): Promise<GetNextUpResponse> {
        this.logger.verbose(`[${req.user.name}] GET to /api/nextup`);

        const { NEXTUP_URL, NEXTUP_USER_ID, NEXTUP_API_TOKEN } = this.apiConfig;

        try {
            const url = `${NEXTUP_URL}/Users/${NEXTUP_USER_ID}/Items/Latest?api_key=${NEXTUP_API_TOKEN}&userId=${NEXTUP_USER_ID}&IncludeItemTypes=Episode&Limit=30&Fields=PrimaryImageAspectRatio,BasicSyncInfo&ImageTypeLimit=1&EnableImageTypes=Primary,Backdrop,Thumb`;
            const response: UserLatestResponse = await got(url).json();

            const userLatestItems = response.map((userLatestItem) => {
                return {
                    name: userLatestItem.Name,
                    seriesName: userLatestItem.SeriesName,
                    communityRating: userLatestItem.CommunityRating,
                    seasonNr: userLatestItem.ParentIndexNumber,
                    epNr: userLatestItem.IndexNumber,
                    seriesId: userLatestItem.SeriesId || userLatestItem.Id,
                };
            });

            const seriesNextupPromises = userLatestItems.map((element) => {
                const tvShowNextUpUrl = `${NEXTUP_URL}/Shows/NextUp?api_key=${NEXTUP_API_TOKEN}&userId=${NEXTUP_USER_ID}&seriesId=${element.seriesId}&IncludeItemTypes=Episode&Limit=30&Fields=PrimaryImageAspectRatio,BasicSyncInfo&ImageTypeLimit=1&EnableImageTypes=Primary,Backdrop,Thumb`;
                const response: Promise<ShowNextUpResponse> =
                    got(tvShowNextUpUrl).json();
                return response;
            });
            const seriesNextupResponses = await Promise.all(
                seriesNextupPromises
            );

            const result = seriesNextupResponses
                .map((response) => response.Items[0] ?? undefined)
                .filter(isDefined);

            return {
                items: result,
            };
        } catch (err) {
            this.logger.error(`[${req.user.name}] ${err}`);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // TODO stream the video itself. Needs ParentId?
    @UseGuards(JwtAuthGuard)
    @Get("thumbnail/:id")
    async getThumbnail(
        @Param("id") id: string,
        @Query("imageTagsPrimary") imageTagsPrimary: string,
        @Query("big") big: "on" | "off",
        @Request() req: AuthenticatedRequest
    ): Promise<StreamableFile> {
        this.logger.verbose(
            `[${req.user.name}] GET to /api/nextup/thumbnail/:id ${id}`
        );

        try {
            const size =
                big === "on" ? "maxWidth=1920" : "fillHeight=180&fillWidth=320";
            const { NEXTUP_URL } = this.apiConfig;
            const streamUrl = `${NEXTUP_URL}/Items/${id}/Images/Primary?${size}&quality=96&tag=${imageTagsPrimary}`;

            if (!NEXTUP_URL) {
                this.logger.error(`[${req.user.name}] missing configuration`);
                throw new HttpException(
                    "failed to receive downstream data",
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }

            const str = got.stream(streamUrl);
            return new StreamableFile(str);
        } catch (err) {
            this.logger.error(`[${req.user.name}] ${err}`);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("video/:id")
    async getVideo(
        @Param("id") id: string,
        @Request() req: AuthenticatedRequest
    ): Promise<StreamableFile> {
        this.logger.verbose(
            `[${req.user.name}] GET to /api/nextup/video/:id ${id}`
        );

        try {
            const { NEXTUP_URL, NEXTUP_API_TOKEN } = this.apiConfig;
            const streamUrl = `${NEXTUP_URL}/Videos/${id}/stream.mkv?api_key=${NEXTUP_API_TOKEN}`;

            if (!NEXTUP_URL) {
                this.logger.error(`[${req.user.name}] missing configuration`);
                throw new HttpException(
                    "failed to receive downstream data",
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }

            const str = got.stream(streamUrl);
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
