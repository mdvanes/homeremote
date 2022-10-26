import { Test, TestingModule } from "@nestjs/testing";
import { MonitController } from "./monit.controller";

describe("MonitController", () => {
    let controller: MonitController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MonitController],
        }).compile();

        controller = module.get<MonitController>(MonitController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
