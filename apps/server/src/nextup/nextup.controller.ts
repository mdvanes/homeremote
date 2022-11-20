import {
    GetNextUpResponse,
    GetScheduleResponse,
    NextUpVideoItem,
    ShowNextUpResponse,
    UserLatestResponse,
} from "@homeremote/types";
import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    Request,
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

    constructor(private configService: ConfigService) {
        this.logger = new Logger(NextupController.name);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getNextUp(
        @Request() req: AuthenticatedRequest
    ): Promise<GetNextUpResponse> {
        this.logger.verbose(`[${req.user.name}] GET to /api/nextup`);

        const NEXTUP_URL = this.configService.get<string>("NEXTUP_URL") || "";
        // Create an API token in the Admin dashboard
        const NEXTUP_API_TOKEN =
            this.configService.get<string>("NEXTUP_API_TOKEN") || "";
        const NEXTUP_USER_ID =
            this.configService.get<string>("NEXTUP_USER_ID") || "";

        try {
            // TODO *** DO NOT CHECKIN *** url contains parent ID
            // TODO latest
            const url = `${NEXTUP_URL}/Users/${NEXTUP_USER_ID}/Items/Latest?api_key=${NEXTUP_API_TOKEN}&userId=${NEXTUP_USER_ID}&IncludeItemTypes=Episode&Limit=30&Fields=PrimaryImageAspectRatio,BasicSyncInfo&ParentId=&ImageTypeLimit=1&EnableImageTypes=Primary,Backdrop,Thumb`;
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
                const tvShowNextUpUrl = `${NEXTUP_URL}/Shows/NextUp?api_key=${NEXTUP_API_TOKEN}&userId=${NEXTUP_USER_ID}&seriesId=${element.seriesId}&IncludeItemTypes=Episode&Limit=30&Fields=PrimaryImageAspectRatio,BasicSyncInfo&ParentId=&ImageTypeLimit=1&EnableImageTypes=Primary,Backdrop,Thumb`;
                const response: Promise<ShowNextUpResponse> =
                    got(tvShowNextUpUrl).json();
                return response;
            });
            const seriesNextupResponses = await Promise.all(
                seriesNextupPromises
            );
            // seriesNextupResponses.map((item) => {
            //     const {
            //         SeriesName,
            //         ParentIndexNumber,
            //         IndexNumber,
            //         Name,
            //         ProductionYear,
            //         CommunityRating,
            //         ImageTags,
            //     } = item?.Items[0] ?? {};
            //     console.log(
            //         `seriesNextupResults: ${SeriesName} ${ParentIndexNumber}x${IndexNumber} ${Name} (${ProductionYear}) ${CommunityRating}👍`,
            //         ImageTags
            //     );
            // });

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
}
