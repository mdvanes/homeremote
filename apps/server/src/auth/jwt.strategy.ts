import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { jwtConstants } from "./constants";
import { User } from "../users/users.service";

interface WebsocketRequest {
    client?: {
        request?: {
            headers?: {
                cookie?: string;
            };
        };
    };
}

// Note: this seems to happen on profile check
interface LogInRequest {
    client?: {
        request?: unknown;
    };
}

// Note: cookieParser.JSONCookie should be able to do this, but it just returns undefined
const parseCookie = (str: string): Record<string, string> => {
    const cookies = str.split("; ");
    const cookieItemsList = cookies.map((cookie) => cookie.split("="));
    return Object.fromEntries(cookieItemsList);
};

const getAuthenticationFromWs = (request: WebsocketRequest): string => {
    const cookieStr = request?.client?.request?.headers?.cookie;
    if (cookieStr) {
        const cookies = parseCookie(request?.client?.request?.headers?.cookie);
        return cookies.Authentication ?? "";
    } else {
        return "";
    }
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request | LogInRequest | WebsocketRequest) => {
                    // @ts-ignore
                    console.log("extract1: ", request?._eventsCount);
                    // @ts-ignore
                    console.log("extract2: ", request?._events);
                    // @ts-ignore
                    return request?.cookies?.Authentication;
                    // TODO this is garbage, it only worked because socket.io was downgrading to http
                    // TODO WebSocket does not support forwarding cookies, so also no httponly cookies
                    // if ("client" in request && request?.client?.request) {
                    //     return getAuthenticationFromWs(request);
                    // } else if ("cookies" in request) {
                    //     return request?.cookies?.Authentication;
                    // } else {
                    //     return "";
                    // }
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
