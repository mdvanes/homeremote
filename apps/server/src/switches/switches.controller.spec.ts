import { DomoticzTypeOptions } from "@homeremote/types";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import * as Got from "got";
import { AuthenticatedRequest } from "../login/LoginRequest.types";
import { DomoticzSwitch, SwitchesController } from "./switches.controller";

vi.mock("got");
const gotSpy = vi.spyOn(Got, "default");

const mockAuthenticatedRequest = {
    user: { name: "someuser", id: 1 },
} as AuthenticatedRequest;

describe("Switches Controller", () => {
    let controller: SwitchesController;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SwitchesController],
            providers: [{ provide: ConfigService, useValue: { get: vi.fn() } }],
        }).compile();

        configService = module.get<ConfigService>(ConfigService);
        controller = module.get<SwitchesController>(SwitchesController);

        vi.spyOn(configService, "get").mockImplementation((envName) => {
            if (envName === "DOMOTICZ_URI") {
                return "some.url";
            }
        });
    });

    it("returns the switches states on /GET ", async () => {
        const mockSwitch: DomoticzSwitch = {
            idx: "1",
            Type: DomoticzTypeOptions.LightSwitch,
            Name: "My Switch",
            Status: "on",
            SwitchType: DomoticzTypeOptions.LightSwitch,
            Level: 0,
            Protected: false,
        };
        gotSpy.mockResolvedValue({
            body: JSON.stringify({ status: "OK", result: [mockSwitch] }),
        });
        expect(await controller.getSwitches(mockAuthenticatedRequest)).toEqual({
            status: "received",
            switches: [
                {
                    idx: "1",
                    type: "Light/Switch",
                    name: "My Switch",
                    status: "on",
                    dimLevel: null,
                    readOnly: false,
                    children: false,
                    origin: "domoticz",
                },
            ],
        });
    });

    it("returns error status on failed /GET ", async () => {
        gotSpy.mockRejectedValue("Mock Server Down");
        expect(await controller.getSwitches(mockAuthenticatedRequest)).toEqual({
            status: "error",
        });
    });

    it("returns error status on non-OK /GET ", async () => {
        gotSpy.mockResolvedValue({
            body: JSON.stringify({ status: "error" }),
        });
        expect(await controller.getSwitches(mockAuthenticatedRequest)).toEqual({
            status: "error",
        });
    });

    it("returns error status on unparsable /GET ", async () => {
        gotSpy.mockResolvedValue({
            body: "not json",
        });
        expect(await controller.getSwitches(mockAuthenticatedRequest)).toEqual({
            status: "error",
        });
    });
});
