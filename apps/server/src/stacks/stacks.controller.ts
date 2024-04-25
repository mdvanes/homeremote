import {
    PortainerStack,
    PortainerStacksResponse,
    StackItem,
    StacksResponse,
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
    UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import got from "got";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AuthenticatedRequest } from "../login/LoginRequest.types";

const mapStackProps = ({
    Id,
    Name,
    Status,
    EndpointId,
}: PortainerStack): StackItem => ({
    Id,
    Name,
    Status,
    EndpointId,
});

@Controller("api/stacks")
export class StacksController {
    private readonly logger: Logger;
    private readonly baseUrl: string;
    private readonly apikey: string;

    constructor(private configService: ConfigService) {
        this.logger = new Logger(StacksController.name);
        this.baseUrl =
            this.configService.get<string>("PORTAINER_BASE_URL") || "";
        this.apikey = this.configService.get<string>("PORTAINER_API_KEY") || "";
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getStatus(
        @Request() req: AuthenticatedRequest
    ): Promise<StacksResponse> {
        this.logger.verbose(`[${req.user.name}] GET to /api/stacks`);

        try {
            const response = await got(`${this.baseUrl}/api/stacks`, {
                headers: {
                    "X-API-KEY": this.apikey,
                },
            }).json<PortainerStacksResponse>();
            const status = response.map(mapStackProps);
            return status;
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("start/:id")
    async startContainer(
        @Request() req: AuthenticatedRequest,
        @Param("id") id: string,
        @Query("endpointId") endpointId: string
    ): Promise<StackItem> {
        this.logger.verbose(
            `[${req.user.name}] GET to /api/stacks/start/${id}`
        );

        try {
            const response = await got
                .post(
                    `${this.baseUrl}/api/stacks/${id}/start?endpointId=${endpointId}`,
                    {
                        headers: {
                            "X-API-KEY": this.apikey,
                        },
                    }
                )
                .json<PortainerStack>();

            return mapStackProps(response);
        } catch (err) {
            this.logger.error(err);
            console.log(err);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("stop/:id")
    async stopContainer(
        @Request() req: AuthenticatedRequest,
        @Param("id") id: string,
        @Query("endpointId") endpointId: string
    ): Promise<StackItem> {
        this.logger.verbose(`[${req.user.name}] GET to /api/stacks/stop/${id}`);

        try {
            const response = await got
                .post(
                    `${this.baseUrl}/api/stacks/${id}/stop?endpointId=${endpointId}`,
                    {
                        headers: {
                            "X-API-KEY": this.apikey,
                        },
                    }
                )
                .json<PortainerStack>();

            return mapStackProps(response);
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
