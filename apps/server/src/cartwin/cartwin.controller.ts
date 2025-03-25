import { CarTwinResponse, State } from "@homeremote/types";
import {
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

@Controller("api/cartwin")
export class CarTwinController {
    private readonly logger: Logger;
    // private readonly apiConfig: {
    //     vin: string;
    //     vccApiKey: string;
    // };
    private readonly haApiConfig: {
        baseUrl: string;
        token: string;
        trackerIds: string;
    };

    constructor(private configService: ConfigService) {
        this.logger = new Logger(CarTwinController.name);

        // const vin = this.configService.get<string>("CARTWIN_VIN") || "";
        // const vccApiKey =
        //     this.configService.get<string>("CARTWIN_VCC_API_KEY") || "";

        // this.apiConfig = {
        //     vin,
        //     vccApiKey,
        // };

        this.haApiConfig = {
            baseUrl:
                this.configService.get<string>("HOMEASSISTANT_BASE_URL") || "",
            token: this.configService.get<string>("HOMEASSISTANT_TOKEN") || "",
            trackerIds:
                this.configService.get<string>("HOMEASSISTANT_TRACKER_IDS") ||
                "",
        };
    }

    async fetchHa<T>(path: string): Promise<T> {
        const response = await fetch(`${this.haApiConfig.baseUrl}${path}`, {
            headers: {
                Authorization: `Bearer ${this.haApiConfig.token}`,
            },
        });
        return response.json() as T;
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async getCarTwin(
        @Request() req: AuthenticatedRequest
        // @Body()
        // body: {
        //     energyToken: string;
        //     connectedToken: string;
        //     extendedToken: string;
        // }
    ): Promise<CarTwinResponse> {
        this.logger.verbose(`[${req.user.name}] GET to /api/cartwin`);

        // const { vin, vccApiKey } = this.apiConfig;
        // const { connectedToken, energyToken } = body;
        // const volvo = volvocarsApiSdk({
        //     vin,
        //     vccApiKey,
        //     connectedToken,
        //     energyToken,
        // });

        try {
            const url = `/api/states/${
                this.haApiConfig.trackerIds.split(",")[0]
            }`;
            const result = await this.fetchHa<State>(url);

            const { charge, speed, odometer } = result.attributes as {
                charge?: string;
                speed: string;
                odometer: string;
                altitude: string;
                icon: string;
                friendly_name: string;
                latitude: number;
                longitude: number;
            };

            return {
                connected: {
                    odometer: { value: odometer, unit: "km" },
                    doors: {},
                    vehicleMetadata: {},
                    statistics: {
                        averageSpeed: { value: speed, unit: "km/h" },
                    },
                    diagnostics: {},
                    tyres: {},
                },
                energy: {
                    batteryChargeLevel: { value: charge, unit: "%" },
                    electricRange: { value: "0", unit: "km" },
                },
            };

            // return {
            //     connected: await volvo.getConnectedVehicle(),
            //     energy: await volvo.getEnergy(),
            // };
        } catch (err) {
            this.logger.error(`[${req.user.name}] ${err}`);
            throw new HttpException(
                "failed to receive downstream data",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // @UseGuards(JwtAuthGuard)
    // @Post()
    // async getCarTwin(
    //     @Request() req: AuthenticatedRequest,
    //     @Body()
    //     body: {
    //         energyToken: string;
    //         connectedToken: string;
    //         extendedToken: string;
    //     }
    // ): Promise<CarTwinResponse> {
    //     this.logger.verbose(`[${req.user.name}] GET to /api/cartwin`);

    //     const { vin, vccApiKey } = this.apiConfig;
    //     const { connectedToken, energyToken } = body;
    //     const volvo = volvocarsApiSdk({
    //         vin,
    //         vccApiKey,
    //         connectedToken,
    //         energyToken,
    //     });

    //     try {
    //         return {
    //             connected: await volvo.getConnectedVehicle(),
    //             energy: await volvo.getEnergy(),
    //         };
    //     } catch (err) {
    //         this.logger.error(`[${req.user.name}] ${err}`);
    //         throw new HttpException(
    //             "failed to receive downstream data",
    //             HttpStatus.INTERNAL_SERVER_ERROR
    //         );
    //     }
    // }
}
