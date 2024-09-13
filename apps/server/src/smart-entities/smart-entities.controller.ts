import {
    GetHaStatesResponse,
    State,
    type SmartEntitiesTypes,
} from "@homeremote/types";
import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Logger,
    Param,
    Post,
    Request,
    UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AuthenticatedRequest } from "../login/LoginRequest.types";

@Controller("api/smart-entities")
export class SmartEntitiesController {
    private readonly logger: Logger;

    private readonly haApiConfig: {
        baseUrl: string;
        token: string;
        entityId: string;
    };

    constructor(private configService: ConfigService) {
        this.logger = new Logger(SmartEntitiesController.name);

        this.haApiConfig = {
            baseUrl:
                this.configService.get<string>("HOMEASSISTANT_BASE_URL") || "",
            token: this.configService.get<string>("HOMEASSISTANT_TOKEN") || "",
            entityId:
                this.configService.get<string>("HOMEASSISTANT_SWITCHES_ID") ||
                "",
        };
    }

    async fetchHa(path: string): Promise<unknown> {
        const response = await fetch(`${this.haApiConfig.baseUrl}${path}`, {
            headers: {
                Authorization: `Bearer ${this.haApiConfig.token}`,
            },
        });
        return response.json();
    }

    async fetchHaEntityState(
        entityId: string
    ): Promise<SmartEntitiesTypes.GetSmartEntitiesResponse> {
        return this.fetchHa(`/api/states/${entityId}`);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getSmartEntities(
        @Request() req: AuthenticatedRequest
    ): Promise<SmartEntitiesTypes.GetSmartEntitiesResponse> {
        this.logger.verbose(
            `[${req.user.name}] GET to /smart-entities for entityId ${this.haApiConfig.entityId}`
        );

        try {
            const switchIds: GetHaStatesResponse = await this.fetchHa(
                `/api/states/${this.haApiConfig.entityId}`
            );
            console.log("switchIds", switchIds);

            if ("message" in switchIds && switchIds.message) {
                throw new Error(switchIds.message);
            }

            if ("attributes" in switchIds) {
                const allHaStates = (await this.fetchHa(
                    `/api/states`
                )) as State[];
                const switchStates = allHaStates.filter((state) =>
                    switchIds.attributes.entity_id.includes(state.entity_id)
                );

                return {
                    switches: switchStates,
                } as SmartEntitiesTypes.GetSmartEntitiesResponse;
            }

            throw new Error("no attributes property");
        } catch (err) {
            this.logger.error(`[${req.user.name}] ${err}`);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post("/:entityId")
    async updateSmartEntity(
        @Param("entityId") entityId: string,
        @Body() args: SmartEntitiesTypes.UpdateSmartEntityArgs,
        @Request() req: AuthenticatedRequest
    ): Promise<SmartEntitiesTypes.UpdateSmartEntityResponse> {
        this.logger.verbose(
            `[${req.user.name}] POST to /smart-entities/${entityId} with state: ${args.state}`
        );

        try {
            const [entityType] = entityId.split(".");
            const pathType = entityType === "light" ? "light" : "switch";
            // TODO use helper and add Arg/Response types
            await fetch(
                `${
                    this.haApiConfig.baseUrl
                }/api/services/${pathType}/turn_${args.state.toLowerCase()}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${this.haApiConfig.token}`,
                    },
                    body: JSON.stringify({ entity_id: entityId }),
                }
            );
            return "received";
        } catch (err) {
            this.logger.error(`[${req.user.name}] ${err}`);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
