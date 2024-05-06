import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { ServiceLinksController } from "./service-links.controller";

describe("ServiceLinksController", () => {
    let controller: ServiceLinksController;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ServiceLinksController],
            providers: [
                { provide: ConfigService, useValue: { get: jest.fn() } },
            ],
        }).compile();

        configService = module.get<ConfigService>(ConfigService);
        controller = module.get<ServiceLinksController>(ServiceLinksController);
    });

    it("returns list of services on /GET", async () => {
        jest.spyOn(configService, "get").mockImplementation((envName) => {
            if (envName === "SERVICE_LINKS") {
                return "foo,bar,baz";
            }
        });

        const response = await controller.getServiceLinks();
        expect(response).toEqual({
            status: "received",
            servicelinks: [{ icon: "bar", label: "foo", url: "baz" }],
        });
    });

    it("throws an error when config service fails", async () => {
        jest.spyOn(configService, "get").mockImplementation((envName) => {
            if (envName === "SERVICE_LINKS") {
                throw Error("meow");
            }
        });

        await expect(controller.getServiceLinks()).rejects.toThrow(
            "failed to parse service links"
        );
    });
});
