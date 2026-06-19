import { PortainerStack, PortainerStacksResponse } from "@homeremote/types";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import got, { CancelableRequest } from "got";
import { mockAuthenticatedRequest } from "../util/test-helpers/mockAuthenticatedRequest";
import { StacksController } from "./stacks.controller";

vi.mock("got");
const mockGot = vi.mocked(got);

describe("Stacks Controller", () => {
    let controller: StacksController;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [StacksController],
            providers: [{ provide: ConfigService, useValue: { get: vi.fn() } }],
        }).compile();

        configService = module.get<ConfigService>(ConfigService);
        controller = module.get<StacksController>(StacksController);

        vi.spyOn(configService, "get").mockImplementation(() => "");
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
        expect(mockGot).toHaveBeenCalledTimes(1);
        expect(mockGot).toHaveBeenCalledWith("/api/stacks", {
            headers: {
                "X-API-KEY": "",
            },
        });
    });
});
