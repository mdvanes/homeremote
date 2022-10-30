import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { jwtConstants } from "./constants";
import { User } from "../users/users.service";
import cookieParser from "cookie-parser";

interface WebsocketRequest {
    client?: {
        request?: {
            headers?: {
                cookie?: string;
            };
        };
    };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request | WebsocketRequest) => {
                    if ("client" in request) {
                        // console.log("extract", request?.cookies?.Authentication);
                        console.log(
                            "extract:",
                            request?.client?.request?.headers?.cookie
                        );
                        const x = cookieParser.JSONCookie(
                            request?.client?.request?.headers?.cookie
                        );
                        console.log("extract c:", x);
                        return "?";
                    } else if ("cookies" in request) {
                        return request?.cookies?.Authentication;
                    }
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    async validate(payload: {
        sub: number;
        username: string;
    }): Promise<Omit<User, "displayName">> {
        // This is called each time @UseGuards(JwtAuthGuard) is used
        return { id: payload.sub, name: payload.username };
    }
}
