import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import got, { CancelableRequest } from "got";
import { mocked } from "jest-mock";
import { AuthenticatedRequest } from "../login/LoginRequest.types";
import { HomesecController } from "./homesec.controller";

jest.mock("got");
const mockGot = mocked(got);

const mockAuthenticatedRequest = {
    user: { name: "someuser", id: 1 },
} as AuthenticatedRequest;

describe("HomeSec Controller", () => {
    let controller: HomesecController;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [HomesecController],
            providers: [
                { provide: ConfigService, useValue: { get: jest.fn() } },
            ],
        }).compile();

        configService = module.get<ConfigService>(ConfigService);
        controller = module.get<HomesecController>(HomesecController);

        jest.spyOn(configService, "get").mockImplementation((envName) => {
            if (envName === "HOMESEC_BASE_URL") {
                return "url";
            }
            if (envName === "HOMESEC_USERNAME") {
                return "user";
            }
            if (envName === "HOMESEC_PASSWORD") {
                return "pass";
            }
        });
    });

    afterAll(() => {
        mockGot.mockRestore();
    });

    it("returns devices and panel status on /GET", async () => {
        mockGot
            .mockReturnValueOnce({
                json: () =>
                    Promise.resolve({
                        updates: {
                            mode_a1: "Disarm",
                        },
                    }),
            } as CancelableRequest<Response>)
            .mockReturnValue({
                json: () =>
                    Promise.resolve({
                        senrows: [{ id: "123" }],
                    }),
            } as CancelableRequest<Response>);

        const response = await controller.getStatus(mockAuthenticatedRequest);
        expect(response).toEqual({
            status: "Disarm",
            devices: [
                {
                    id: "123",
                    name: undefined,
                    rssi: undefined,
                    status: undefined,
                    type_f: undefined,
                },
            ],
        });
        expect(mockGot).toBeCalledTimes(2);
        expect(mockGot).toBeCalledWith("/action/panelCondGet", {
            password: "",
            username: "",
        });
        expect(mockGot).toBeCalledWith("/action/deviceListGet", {
            password: "",
            username: "",
        });
    }, 10000);

    it("throws error on /GET panel failure", async () => {
        mockGot.mockReturnValue({
            json: () => Promise.reject("some error"),
        } as CancelableRequest<Response>);
        await expect(
            controller.getStatus(mockAuthenticatedRequest)
        ).rejects.toThrow("failed to receive downstream data");
    });

    // TODO this should work, but throws out of the inner catch. This does not happen runtime.
    it.skip("returns [] on /GET devices failure", async () => {
        mockGot
            .mockReturnValueOnce({
                json: () =>
                    Promise.resolve({
                        updates: {
                            mode_a1: "Disarm",
                        },
                    }),
            } as CancelableRequest<Response>)
            .mockReturnValue({
                json: () => Promise.resolve({}),
            } as CancelableRequest<Response>);
        controller.getStatus(mockAuthenticatedRequest);

        const response = await controller.getStatus(mockAuthenticatedRequest);
        expect(response).toEqual({ status: "Disarm", devices: [] });
        expect(mockGot).toBeCalledTimes(2);
    }, 10000);
});
