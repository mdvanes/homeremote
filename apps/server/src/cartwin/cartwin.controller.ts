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
import got from "got/dist/source";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AuthenticatedRequest } from "../login/LoginRequest.types";
import { CarTwinResponse, components, operations } from "@homeremote/types";
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
        // Promise<{
        //     result: object;
        //     odometer: components["schemas"]["Odometer"]["odometer"];
        //     doors: object;
        //     car: object;
        //     statistics: object | undefined;
        //     diagnostics: object | undefined;
        //     tyre: object | undefined;
        //     energy: object | undefined;
        //     frontLeftWindowOpen: object | undefined;
        // }>

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
            // const energyResponse: VolvoFooResponse | undefined =
            //     body.energyToken
            //         ? await got(
            //               `${baseUrl}/energy/v1/vehicles/${vin}/recharge-status`,
            //               {
            //                   headers: {
            //                       ...headers,
            //                       authorization: `Bearer ${body.energyToken}`,
            //                       accept: "application/vnd.volvocars.api.energy.vehicledata.v1+json",
            //                   },
            //               }
            //           ).json()
            //         : undefined;
            // // this.logger.debug(body.energyToken, energyResponse);

            // TODO the extended vehicle API seems not to be available
            // try {
            //     const frontLeftWindowOpenResponse:
            //         | VolvoFooResponse
            //         | undefined = body.extendedToken
            //         ? await got(
            //               `${baseUrl}/extended-vehicle/v1/vehicles/${vin}/resources`,
            //               //  `${baseUrl}/extended-vehicle/v1/vehicles/${vin}/resources/frontLeftWindowOpen`,
            //               {
            //                   headers: {
            //                       ...headers,
            //                       authorization: `Bearer ${body.energyToken}`,
            //                       accept: "application/json",
            //                   },
            //               }
            //           ).json()
            //         : undefined;
            //     this.logger.debug(frontLeftWindowOpenResponse);
            // } catch (err) {
            //     this.logger.error("frontLeftWindowOpen", err);
            // }

            return {
                connected: await volvo.getConnectedVehicle(),
                energy: await volvo.getEnergy(),
                // frontLeftWindowOpen: undefined, // frontLeftWindowOpenResponse,
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
