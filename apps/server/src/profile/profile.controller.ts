import {
    Controller,
    Get,
    Logger,
    Request,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import type { LoginMethod } from "../auth/auth.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import type { AuthenticatedRequest } from "../login/LoginRequest.types";
import { User, UsersService } from "../users/users.service";

export interface ProfileResponse extends User {
    loginMethod: LoginMethod;
}

@Controller("api/profile")
export class ProfileController {
    private readonly logger: Logger;

    constructor(private readonly usersService: UsersService) {
        this.logger = new Logger(ProfileController.name);
    }

    // Use this to show the "logged in as user"
    @UseGuards(JwtAuthGuard)
    @Get("current")
    async getProfile(
        @Request() req: AuthenticatedRequest
    ): Promise<ProfileResponse> {
        this.logger.verbose(`current: ${JSON.stringify(req.user)}`);
        const user = await this.usersService.findOne(req.user.name);
        if (!user) {
            throw new UnauthorizedException();
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { hash, ...userWithoutHash } = user;
        return { ...userWithoutHash, loginMethod: req.user.loginMethod };
    }
}
