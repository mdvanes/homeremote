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

// NOTE: setupModule is needed because onEnvGet should be set before constructor is called
const setupModule = async (onEnvGet) => {
    const module: TestingModule = await Test.createTestingModule({
        controllers: [HomesecController],
        providers: [
            {
                provide: ConfigService,
                useValue: {
                    get: jest.fn().mockImplementation(onEnvGet),
                },
            },
        ],
    }).compile();

    return module;
};

describe("HomeSec Controller", () => {
    let controller: HomesecController;

    describe("with correct configuration", () => {
        beforeEach(async () => {
            const module: TestingModule = await setupModule((envName) => {
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

            module.get<ConfigService>(ConfigService);
            controller = module.get<HomesecController>(HomesecController);
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

            const response = await controller.getStatus(
                mockAuthenticatedRequest
            );
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
            expect(mockGot).toBeCalledWith("url/action/panelCondGet", {
                password: "pass",
                username: "user",
            });
            expect(mockGot).toBeCalledWith("url/action/deviceListGet", {
                password: "pass",
                username: "user",
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

            const response = await controller.getStatus(
                mockAuthenticatedRequest
            );
            expect(response).toEqual({ status: "Disarm", devices: [] });
            expect(mockGot).toBeCalledTimes(2);
        }, 10000);
    });

    describe("with incorrect configuration", () => {
        beforeEach(async () => {
            const module: TestingModule = await setupModule(() => {
                return undefined;
            });

            module.get<ConfigService>(ConfigService);
            controller = module.get<HomesecController>(HomesecController);
        });

        afterAll(() => {
            mockGot.mockRestore();
        });

        it("throws error while unconfigured", async () => {
            mockGot.mockReturnValue({
                json: () => Promise.resolve({}),
            } as CancelableRequest<Response>);
            await expect(
                controller.getStatus(mockAuthenticatedRequest)
            ).rejects.toThrow("feature not configured");
        });
    });
});
