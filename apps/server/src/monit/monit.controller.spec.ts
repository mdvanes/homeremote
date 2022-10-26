import { Test, TestingModule } from "@nestjs/testing";
import { MonitController } from "./monit.controller";
import got, { Response, CancelableRequest } from "got";
import { ConfigService } from "@nestjs/config";

jest.mock("got");
// const mockGot = mocked(got);

describe("MonitController", () => {
    let controller: MonitController;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MonitController],
            providers: [
                { provide: ConfigService, useValue: { get: jest.fn() } },
            ],
        }).compile();

        configService = module.get<ConfigService>(ConfigService);
        controller = module.get<MonitController>(MonitController);

        jest.spyOn(configService, "get").mockImplementation((envName) => {
            return "a,b,c;d,e,f";
        });
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
