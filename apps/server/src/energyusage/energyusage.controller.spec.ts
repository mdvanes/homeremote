import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import got, { CancelableRequest } from "got";
import { mocked } from "jest-mock";
import { AuthenticatedRequest } from "../login/LoginRequest.types";
import { EnergyUsageController } from "./energyusage.controller";
import {
    EnergyUsageGetWaterResponse,
    PortainerStack,
    PortainerStacksResponse,
} from "@homeremote/types";

jest.mock("got");
const mockGot = mocked(got);

const mockAuthenticatedRequest = {
    user: { name: "someuser", id: 1 },
} as AuthenticatedRequest;

describe("EnergyUsage Controller", () => {
    let controller: EnergyUsageController;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EnergyUsageController],
            providers: [
                { provide: ConfigService, useValue: { get: jest.fn() } },
            ],
        }).compile();

        configService = module.get<ConfigService>(ConfigService);
        controller = module.get<EnergyUsageController>(EnergyUsageController);

        jest.spyOn(configService, "get").mockImplementation(() => "");
    });

    afterAll(() => {
        mockGot.mockRestore();
    });

    it("returns stacks on /GET", async () => {
        jest.useFakeTimers().setSystemTime(new Date("2024-04-25"));

        const mockWaterResponse: EnergyUsageGetWaterResponse = [
            [
                {
                    entity_id: "water_id",
                    state: "1",
                    attributes: {},
                    last_changed: "123",
                    last_updated: "124",
                },
            ],
        ] as EnergyUsageGetWaterResponse;
        mockGot.mockReturnValue({
            json: () => Promise.resolve(mockWaterResponse),
        } as CancelableRequest<Response>);

        const response = await controller.getWater(mockAuthenticatedRequest);
        expect(response).toEqual([
            [
                {
                    entity_id: "water_id",
                    state: "1",
                    attributes: {},
                    last_changed: "123",
                    last_updated: "124",
                },
            ],
        ]);
        expect(mockGot).toBeCalledTimes(1);
        expect(mockGot).toBeCalledWith(
            "/api/history/period/2024-04-25T00:00:00Z?filter_entity_id=",
            {
                headers: {
                    Authorization: "Bearer ",
                },
            }
        );
    });
});
