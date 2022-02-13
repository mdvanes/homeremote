import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "../auth/auth.module";
import { LoginController } from "../login/login.controller";
import { ProfileController } from "../profile/profile.controller";
import { PwToHashController } from "../pw-to-hash/pw-to-hash.controller";
import { SwitchesController } from "../switches/switches.controller";
import { UsersModule } from "../users/users.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { StatusController } from "../status/status.controller";

@Module({
    imports: [
        AuthModule,
        UsersModule,
        ConfigModule
            .forRoot
            // TODO ConfigModule can also use a yaml instead of a .env file
            //     validationSchema: Joi.object({
            //         STATUS_CMD: Joi.string().default("echo 'test status cmd'"),
            //         SOME_VAR: Joi.string().required,
            //     }),
            (),
    ],
    controllers: [
        AppController,
        ProfileController,
        LoginController,
        StatusController,
        SwitchesController,
        PwToHashController,
    ],
    providers: [AppService],
})
export class AppModule {}
