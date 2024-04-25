import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import got, { CancelableRequest } from "got";
import { mocked } from "jest-mock";
import { AuthenticatedRequest } from "../login/LoginRequest.types";
import { StacksController } from "./stacks.controller";
import { PortainerStack, PortainerStacksResponse } from "@homeremote/types";

jest.mock("got");
const mockGot = mocked(got);

const mockAuthenticatedRequest = {
    user: { name: "someuser", id: 1 },
} as AuthenticatedRequest;

describe("Stacks Controller", () => {
    let controller: StacksController;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [StacksController],
            providers: [
                { provide: ConfigService, useValue: { get: jest.fn() } },
            ],
        }).compile();

        configService = module.get<ConfigService>(ConfigService);
        controller = module.get<StacksController>(StacksController);

        jest.spyOn(configService, "get").mockImplementation(() => "");
    });

    afterAll(() => {
        mockGot.mockRestore();
    });

    it("returns stacks on /GET", async () => {
        const mockPortainerStackResponse: PortainerStacksResponse = [
            {
                Id: 123,
                Name: "someName",
                Status: 1,
                EndpointId: 456,
            } as Partial<PortainerStack>,
        ] as PortainerStacksResponse;
        mockGot.mockReturnValue({
            json: () => Promise.resolve(mockPortainerStackResponse),
        } as CancelableRequest<Response>);

        const response = await controller.getStatus(mockAuthenticatedRequest);
        expect(response).toEqual([
            {
                Id: 123,
                Name: "someName",
                Status: 1,
                EndpointId: 456,
            },
        ]);
        expect(mockGot).toBeCalledTimes(1);
        expect(mockGot).toBeCalledWith("/api/stacks", {
            headers: {
                "X-API-KEY": "",
            },
        });
    });
});
