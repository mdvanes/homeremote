import { Controller, Get, Logger, Req, UseGuards } from "@nestjs/common";
import { clearCookie } from "../auth/auth.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { User } from "../users/users.service";

@Controller("auth/logout")
export class LogoutController {
    private readonly logger: Logger;

    constructor() {
        this.logger = new Logger(LogoutController.name);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async logout(@Req() req): Promise<User> {
        // Note: req.user can only be accessed when @UseGuards(JwtAuthGuard) is added
        this.logger.verbose(`logout: ${JSON.stringify(req.user)}`);
        if (req.res) {
            req.res.clearCookie(...clearCookie);
        }
        return {
            id: 0,
            name: "",
            displayName: "",
        };
    }
}
