import { Test, TestingModule } from "@nestjs/testing";
import { AuthConfigController } from "./auth-config.controller";
import * as oidcConfig from "./oidc.config";

describe("AuthConfigController", () => {
    let controller: AuthConfigController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthConfigController],
        }).compile();

        controller = module.get<AuthConfigController>(AuthConfigController);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("reports OIDC as enabled when configured", () => {
        vi.spyOn(oidcConfig, "isOidcEnabled").mockReturnValue(true);
        expect(controller.getConfig()).toEqual({ oidc: { enabled: true } });
    });

    it("reports OIDC as disabled when not configured", () => {
        vi.spyOn(oidcConfig, "isOidcEnabled").mockReturnValue(false);
        expect(controller.getConfig()).toEqual({ oidc: { enabled: false } });
    });
});
