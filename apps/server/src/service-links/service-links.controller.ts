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
import { ServiceLinksResponse } from "@homeremote/types";

@Controller("api/servicelinks")
export class ServiceLinksController {
    private readonly logger: Logger;

    constructor(private configService: ConfigService) {
        this.logger = new Logger(ServiceLinksController.name);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getServiceLinks(): Promise<ServiceLinksResponse> {
        const serviceLinksConfig =
            this.configService.get<string>("SERVICE_LINKS") || "";
        const serviceLinksStrings = serviceLinksConfig.split(";");
        const serviceLinks = serviceLinksStrings.map((str) => {
            const [label, icon, url] = str.split(",");
            return { label, icon, url };
        });
        this.logger.verbose(
            `GET to /api/servicelinks (result=${JSON.stringify(serviceLinks)})`
        );
        return {
            status: "received",
            servicelinks: serviceLinks,
        };
        // this.logger.verbose(`GET to /api/downloadlist/pauseDownload: ${id}`);
        // const client = this.getClient();

        // try {
        //     const res = await client.pauseTorrent(id);
        //     // Response is so fast that getDownloadList will not be updated yet (see resumeDownload function)
        //     await wait(500);
        //     return {
        //         status: "received",
        //         message: res.result,
        //     };
        // } catch (err) {
        //     this.logger.error(err);
        //     return { status: "error" };
        // }
    }
}
