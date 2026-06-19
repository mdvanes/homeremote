import { QBittorrent } from "@ctrl/qbittorrent";
import { DownloadItem } from "@homeremote/types";
import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    Param,
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
export class DownloadlistBravoController {
    private readonly logger: Logger;

    constructor(private configService: ConfigService) {
        this.logger = new Logger(DownloadlistBravoController.name);
    }

    getClient(): QBittorrent {
        const client = new QBittorrent({
            baseUrl: this.configService.get<string>("DOWNLOAD_BASE_URL") || "",
            username: this.configService.get<string>("DOWNLOAD_USERNAME") || "",
            password: this.configService.get<string>("DOWNLOAD_PASSWORD") || "",
        });
        return client;
    }

    @UseGuards(JwtAuthGuard)
    @Get("pauseDownload/:id")
    async pauseDownload(
        @Param("id") id: string
    ): Promise<DownloadToggleResponse> {
        this.logger.verbose(`GET to /api/downloadlist/pauseDownload: ${id}`);
        const client = this.getClient();

        try {
            const isPaused = await client.pauseTorrent(id);
            // Response is so fast that getDownloadList will not be updated yet (see resumeDownload function)
            await wait(500);
            return {
                status: "received",
                message: isPaused ? "paused" : "not paused",
            };
        } catch (err) {
            this.logger.error(err);
            return { status: "error" };
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("resumeDownload/:id")
    async resumeDownload(
        @Param("id") id: string
    ): Promise<DownloadToggleResponse> {
        this.logger.verbose(`GET to /api/downloadlist/resumeDownload: ${id}`);
        const client = this.getClient();

        try {
            const isResumed = await client.resumeTorrent(id);
            // A delay is added because the call to downloadlist is done so fast after resumeDownload, that the server did not yet
            // finish changing the status to resumed.
            await wait(500);
            return {
                status: "received",
                message: isResumed ? "resumed" : "not resumed",
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
                mapToDownloadItem(item, String(item.id))
            );

            return {
                status: "received",
                downloads,
            };
        } catch (err) {
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
