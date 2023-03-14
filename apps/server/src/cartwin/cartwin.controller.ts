import { CarTwinResponse } from "@homeremote/types";
import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Logger,
    Post,
    Request,
    UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AuthenticatedRequest } from "../login/LoginRequest.types";
import { volvocarsApiSdk } from "./volvocarsApiSdk";

@Controller("api/cartwin")
export class CarTwinController {
    private readonly logger: Logger;
    private readonly apiConfig: {
        vin: string;
        vccApiKey: string;
    };

    constructor(private configService: ConfigService) {
        this.logger = new Logger(CarTwinController.name);

        const vin = this.configService.get<string>("CARTWIN_VIN") || "";
        const vccApiKey =
            this.configService.get<string>("CARTWIN_VCC_API_KEY") || "";

        this.apiConfig = {
            vin,
            vccApiKey,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async getCarTwin(
        @Request() req: AuthenticatedRequest,
        @Body()
        body: {
            energyToken: string;
            connectedToken: string;
            extendedToken: string;
        }
    ): Promise<CarTwinResponse> {
        this.logger.verbose(`[${req.user.name}] GET to /api/cartwin`);

        const { vin, vccApiKey } = this.apiConfig;
        const { connectedToken, energyToken } = body;
        const volvo = volvocarsApiSdk({
            vin,
            vccApiKey,
            connectedToken,
            energyToken,
        });

        try {
            return {
                connected: await volvo.getConnectedVehicle(),
                energy: await volvo.getEnergy(),
            };
        } catch (err) {
            this.logger.error(`[${req.user.name}] ${err}`);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
