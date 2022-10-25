import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { XMLParser } from "fast-xml-parser";
import got from "got";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

interface MonitXml {
    monit: {
        server: {
            id: string;
            incarnation: number;
            version: string;
            uptime: number;
            poll: number;
            startdelay: 0;
            localhostname: string;
            controlfile: string;
            httpd: {
                address: string;
                port: number;
                ssl: number;
            };
        };
        platform: {
            name: string;
            release: string;
            version: string;
            machine: string;
            cpu: number;
            memory: number;
            swap: number;
        };
        service: {
            name: string;
            collected_sec: number;
            collected_usec: number;
            status: number;
            status_hint: number;
            monitor: number;
            monitormode: number;
            onreboot: number;
            pendingaction: number;
            every: {
                type: number;
                counter: number;
                number: number;
            };
            program?: {
                started: number;
                status: number;
                output: number;
            };
            port?: {
                hostname: string;
                portnumber: number;
                request: string;
                protocol: string;
                type: string;
                responsetime: number;
            };
            fstype?: string;
            fsflags?: string;
            mode?: number;
            uid?: number;
            gid?: number;
            block?: {
                percent: number;
                usage: number;
                total: number;
            };
            inode?: {
                percent: number;
                usage: number;
                total: number;
            };
            read?: {
                bytes: {
                    count: number;
                    total: number;
                };
                operations: {
                    count: number;
                    total: number;
                };
            };
            write?: {
                bytes: {
                    count: number;
                    total: number;
                };
                operations: {
                    count: number;
                    total: number;
                };
            };
            servicetime?: {
                read: number;
                write: number;
            };
        }[];
    };
}

@Controller("api/monit")
export class MonitController {
    private readonly logger: Logger;
    // private readonly baseUrl: string;
    // private readonly apiConfig: string;

    constructor(private configService: ConfigService) {
        this.logger = new Logger(MonitController.name);
    }

    // getAPI(method: string, option = "") {
    //     return this.baseUrl + method + this.apiConfig + option;
    // }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getPlaylists(): Promise<string> {
        this.logger.verbose("GET to /api/monit");

        const x = this.configService.get<string>("MONIT") || "";
        const monitServers = x.split(",");
        const monitServer1 = monitServers[0].split(";");
        const url = monitServer1[0];
        const username = monitServer1[1];
        const password = monitServer1[2];

        try {
            const response = await got(url, {
                username,
                password,
            }).text();
            const parser = new XMLParser();
            const monitStatus: MonitXml = parser.parse(response);
            // this.logger.verbose(JSON.stringify(y, null, 2));

            const { localhostname, uptime } = monitStatus.monit.server;
            this.logger.verbose(localhostname, uptime);

            const serviceNames = monitStatus.monit.service.map(
                (service) => service.name
            );
            this.logger.verbose(serviceNames.join(", "));
            return response;
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
