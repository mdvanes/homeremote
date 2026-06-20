import { Transmission } from "@ctrl/transmission";
import { DownloadItem } from "@homeremote/types";
import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    Param,
    ParseIntPipe,
    UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { wait } from "../util/wait";
import {
    DownloadListResponse,
    DownloadToggleResponse,
    mapToDownloadItem,
} from "./downloadlist.shared";

@Controller("api/downloadlist")
export class DownloadlistController {
    private readonly logger: Logger;

    constructor(private configService: ConfigService) {
        this.logger = new Logger(DownloadlistController.name);
    }

    getClient(): Transmission {
        const client = new Transmission({
            baseUrl: this.configService.get<string>("DOWNLOAD_BASE_URL") || "",
            username: this.configService.get<string>("DOWNLOAD_USERNAME") || "",
            password: this.configService.get<string>("DOWNLOAD_PASSWORD") || "",
        });
        return client;
    }

    @UseGuards(JwtAuthGuard)
    @Get("pauseDownload/:id")
    async pauseDownload(
        @Param("id", new ParseIntPipe()) id: number
    ): Promise<DownloadToggleResponse> {
        this.logger.verbose(`GET to /api/downloadlist/pauseDownload: ${id}`);
        const client = this.getClient();

        try {
            const res = await client.pauseTorrent(id);
            // Response is so fast that getDownloadList will not be updated yet (see resumeDownload function)
            await wait(500);
            return {
                status: "received",
                message: res.result,
            };
        } catch (err) {
            this.logger.error(err);
            return { status: "error" };
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("resumeDownload/:id")
    async resumeDownload(
        @Param("id", new ParseIntPipe()) id: number
    ): Promise<DownloadToggleResponse> {
        this.logger.verbose(`GET to /api/downloadlist/resumeDownload: ${id}`);
        const client = this.getClient();

        try {
            const res = await client.resumeTorrent(id);
            // A delay is added because the call to downloadlist is done so fast after resumeDownload, that the server did not yet
            // finish changing the status to resumed.
            // Why is this not an issue in the old implementation (with RTK but not RTKQ)? There is over 1s between the resumedownload and the get downloadlist calls!
            // There used to be a 1s delay in the client for that.
            await wait(500);
            return {
                status: "received",
                message: res.result,
            };
        } catch (err) {
            this.logger.error(err);
            return { status: "error" };
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getDownloadList(): Promise<DownloadListResponse> {
        this.logger.verbose("GET to /api/downloadlist");
        const client = this.getClient();

        try {
            const res = await client.getAllData();
            const downloads = res.torrents.map<DownloadItem>((item) =>
                mapToDownloadItem(
                    item,
                    typeof item.id === "number" ? item.id : 0 // TODO just throw an error when item.id is not a number.
                )
            );

            return {
                status: "received",
                downloads,
            };
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
