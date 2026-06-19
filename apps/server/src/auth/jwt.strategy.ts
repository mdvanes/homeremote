import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { LoginMethod } from "./auth.service";
import { User } from "../users/users.service";
import { jwtConstants } from "./constants";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.Authentication;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    async validate(payload: {
        sub: number;
        username: string;
        loginMethod?: LoginMethod;
    }): Promise<Omit<User, "displayName"> & { loginMethod: LoginMethod }> {
        // This is called each time @UseGuards(JwtAuthGuard) is used
        return {
            id: payload.sub,
            name: payload.username,
            loginMethod: payload.loginMethod ?? "local",
        };
    }
}
