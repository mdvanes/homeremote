import { GetMonitResponse, MonitItem, MonitXml } from "@homeremote/types";
import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    UseGuards,
    Request,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { XMLParser } from "fast-xml-parser";
import got from "got";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AuthenticatedRequest } from "../login/LoginRequest.types";

const strToConfigs = (
    monitConfig: string
): { username: string; password: string; url: string }[] => {
    const monitServerStrings = monitConfig.split(";");

    const monitServers = monitServerStrings.map((str) => {
        const [username, password, url] = str.split(",");
        return {
            username,
            password,
            url,
        };
    });
    return monitServers;
};

@Controller("api/monit")
export class MonitController {
    private readonly logger: Logger;

    constructor(private configService: ConfigService) {
        this.logger = new Logger(MonitController.name);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getMonit(
        @Request() req: AuthenticatedRequest
    ): Promise<GetMonitResponse> {
        this.logger.verbose(`[${req.user.name}] GET to /api/monit`);

        const monitConfigStr = this.configService.get<string>("MONIT") || "";
        const monitConfigs = strToConfigs(monitConfigStr);

        const xmlPromises = monitConfigs.map(
            async ({ url, username, password }): Promise<MonitXml> => {
                const response = await got(url, {
                    username,
                    password,
                }).text();
                const parser = new XMLParser();
                const monitStatus: MonitXml = parser.parse(response);
                return monitStatus;
            }
        );

        const monitXmls = await Promise.all(xmlPromises);

        try {
            const monitlist = monitXmls.map((monitStatus): MonitItem => {
                const { localhostname, uptime } = monitStatus.monit.server;
                // this.logger.verbose(localhostname, uptime);
                const services = monitStatus.monit.service.map(
                    ({ name, status, status_hint }) => ({
                        name,
                        status,
                        status_hint,
                    })
                );
                // this.logger.verbose(serviceNames.join(", "));
                return {
                    localhostname,
                    uptime,
                    services,
                };
            });

            return { monitlist };
        } catch (err) {
            this.logger.error(`[${req.user.name}] ${err}`);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
