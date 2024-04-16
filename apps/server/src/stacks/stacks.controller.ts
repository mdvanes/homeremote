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
            const response: PortainerStacksResponse = await got(
                `${this.baseUrl}/api/stacks`,
                {
                    headers: {
                        "X-API-KEY": this.apikey,
                    },
                }
            ).json();
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
}
