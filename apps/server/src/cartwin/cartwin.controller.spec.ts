import { Test, TestingModule } from "@nestjs/testing";
import { CarTwinController } from "./cartwin.controller";

describe.skip("CarTwinController", () => {
    let controller: CarTwinController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CarTwinController],
        }).compile();

        controller = module.get<CarTwinController>(CarTwinController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
