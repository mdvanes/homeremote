import { Test, TestingModule } from "@nestjs/testing";
import { CookieOptions, Response } from "express";
import { AuthService } from "../auth/auth.service";
import { User } from "../users/users.service";
import { LoginRequest } from "./LoginRequest.types";
import { OidcController } from "./oidc.controller";

describe("OidcController", () => {
    let controller: OidcController;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [OidcController],
            providers: [
                {
                    provide: AuthService,
                    useValue: { getCookieWithJwtToken: vi.fn() },
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        controller = module.get<OidcController>(OidcController);
    });

    it("sets the JWT cookie and redirects to / on callback", async () => {
        const mockUser: User = { id: 1, name: "john", displayName: "John" };
        const mockCookie: ["Authentication", string, CookieOptions] = [
            "Authentication",
            "some_token",
            {},
        ];
        vi.spyOn(authService, "getCookieWithJwtToken").mockReturnValue(
            mockCookie
        );

        const res = {
            cookie: vi.fn(),
            redirect: vi.fn(),
        } as unknown as Response;

        await controller.callback({ user: mockUser } as LoginRequest, res);

        expect(authService.getCookieWithJwtToken).toHaveBeenCalledWith(
            mockUser
        );
        expect(res.cookie).toHaveBeenCalledWith(...mockCookie);
        expect(res.redirect).toHaveBeenCalledWith("/");
    });
});
