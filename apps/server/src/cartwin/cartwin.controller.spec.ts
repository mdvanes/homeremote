import { Test, TestingModule } from "@nestjs/testing";
import { CartwinController } from "./cartwin.controller";

describe("CartwinController", () => {
    let controller: CartwinController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CartwinController],
        }).compile();

        controller = module.get<CartwinController>(CartwinController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
