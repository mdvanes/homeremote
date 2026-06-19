import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "../users/users.module";
import { AuthService, EXPIRES_IN_S } from "./auth.service";
import { jwtConstants } from "./constants";
import { JwtStrategy } from "./jwt.strategy";
import { LocalStrategy } from "./local.strategy";
import { oidcStrategyProvider } from "./oidc.strategy";

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: `${EXPIRES_IN_S * 1000}` }, // in ms, see https://github.com/auth0/node-jsonwebtoken#usage
        }),
    ],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        // OIDC is optional: the factory returns null when no oidc config is present.
        oidcStrategyProvider,
    ],
    exports: [AuthService],
})
export class AuthModule {}
