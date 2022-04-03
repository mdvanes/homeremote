import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Logger,
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
        try {
            const serviceLinksConfig =
                this.configService.get<string>("SERVICE_LINKS") || "";
            const serviceLinksStrings = serviceLinksConfig.split(";");
            const serviceLinks = serviceLinksStrings.map((str) => {
                const [label, icon, url] = str.split(",");
                return { label, icon, url };
            });
            this.logger.verbose(
                `GET to /api/servicelinks (result=${JSON.stringify(
                    serviceLinks
                )})`
            );
            return {
                status: "received",
                servicelinks: serviceLinks,
            };
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                "failed to parse service links",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
