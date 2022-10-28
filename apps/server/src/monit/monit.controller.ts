import {
    GetMonitResponse,
    MonitItem,
    MonitService,
    MonitXml,
} from "@homeremote/types";
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
import prettyBytes from "pretty-bytes";
import prettyMs from "pretty-ms";

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

const scaleMonitToBytes = (size: number): number => {
    const length = `${Math.floor(size)}`.length;
    let x = 0;
    if (length > 6) {
        x = size * (1000 / 1.024) * (1000 / 1.024);
    } else if (length > 3) {
        x = size * (1000 / 1.024);
    } else {
        x = size;
    }
    console.log(size, length, x);
    return x;
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
                // console.log(monitStatus.monit.service);
                const services = monitStatus.monit.service.map(
                    ({ name, status, status_hint, block, port }) => {
                        const newBlock: MonitService["block"] = block?.total
                            ? {
                                  ...block,
                                  usage: prettyBytes(
                                      // TODO this formula only works for TB
                                      scaleMonitToBytes(block.usage)
                                      //   block?.usage *
                                      //       (1000 / 1.024) *
                                      //       (1000 / 1.024)
                                  ),
                                  total: prettyBytes(
                                      scaleMonitToBytes(block.total)
                                      //   block?.total *
                                      //       (1000 / 1.024) *
                                      //       (1000 / 1.024)
                                  ),
                              }
                            : undefined;
                        // console.log(block, newBlock);
                        return {
                            name,
                            status,
                            status_hint,
                            block: newBlock,
                            port: {
                                protocol: port?.protocol,
                                portnumber: port?.portnumber,
                            },
                        };
                    }
                );
                return {
                    localhostname,
                    uptime: prettyMs(uptime * 1000),
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
