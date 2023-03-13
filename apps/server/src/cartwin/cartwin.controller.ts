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

        const volvo = volvocarsApiSdk(
            this.apiConfig.vin,
            this.apiConfig.vccApiKey,
            body.connectedToken
        );

        try {
            interface VolvoFooResponse {
                foo: any;
            }

            const baseUrl = "https://api.volvocars.com";

            // const vin = this.configService.get<string>("CARTWIN_VIN") || "";
            // const vccApiKey =
            //     this.configService.get<string>("CARTWIN_VCC_API_KEY") || "";

            const { vin } = this.apiConfig;

            const headers = {
                "vcc-api-key": this.apiConfig.vccApiKey,
                authorization: `Bearer ${body.connectedToken}`,
                accept: "application/vnd.volvocars.api.connected-vehicle.vehicledata.v1+json",
            };

            // TODO handle when only Connected API fails or only Energy API fails.
            // const response: components["schemas"]["OdometerResponse"] =
            //     await got(
            //         // this.getAPI(gasSensor)
            //         `${baseUrl}/connected-vehicle/v1/vehicles/${vin}/odometer`,
            //         {
            //             headers,
            //         }
            //     ).json();
            // this.logger.debug(response);

            const response1: VolvoFooResponse = await got(
                `${baseUrl}/connected-vehicle/v1/vehicles/${vin}/doors`,
                {
                    headers,
                }
            ).json();
            // this.logger.debug(response1);

            const response2: VolvoFooResponse = await got(
                `${baseUrl}/connected-vehicle/v1/vehicles/${vin}`,
                {
                    headers: {
                        ...headers,
                        accept: "application/vnd.volvocars.api.connected-vehicle.vehicle.v1+json",
                    },
                }
            ).json();
            // this.logger.debug(response2);

            const statisticsResponse: VolvoFooResponse = body.connectedToken
                ? await got(
                      `${baseUrl}/connected-vehicle/v1/vehicles/${vin}/statistics`,
                      {
                          headers,
                      }
                  ).json()
                : undefined;

            const diagnosticsResponse: VolvoFooResponse = body.connectedToken
                ? await got(
                      `${baseUrl}/connected-vehicle/v1/vehicles/${vin}/diagnostics`,
                      {
                          headers,
                      }
                  ).json()
                : undefined;

            const tyreResponse: VolvoFooResponse = body.connectedToken
                ? await got(
                      `${baseUrl}/connected-vehicle/v1/vehicles/${vin}/tyres`,
                      {
                          headers,
                      }
                  ).json()
                : undefined;

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
                // result: response,
                // odometer: response.data.odometer,
                connected: await volvo.getConnectedVehicle(),
                // odometer: await volvo.connected.getOdometer(),
                // doors: response1,
                // car: response2,
                // statistics: statisticsResponse,
                diagnostics: diagnosticsResponse,
                tyre: tyreResponse,
                // energy: energyResponse,
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
