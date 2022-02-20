import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { join } from "path";
import { ServeStaticModule } from "@nestjs/serve-static";
import { AuthModule } from "../auth/auth.module";
import { LoginController } from "../login/login.controller";
import { ProfileController } from "../profile/profile.controller";
import { PwToHashController } from "../pw-to-hash/pw-to-hash.controller";
import { SwitchesController } from "../switches/switches.controller";
import { UsersModule } from "../users/users.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { StatusController } from "../status/status.controller";
import { DataloraController } from "../datalora/datalora.controller";
import { DockerlistController } from "../dockerlist/dockerlist.controller";
import { DownloadlistController } from "../downloadlist/downloadlist.controller";
import { UrltomusicController } from "../urltomusic/urltomusic.controller";
import { LogoutController } from "../logout/logout.controller";
import { NowplayingController } from "../nowplaying/nowplaying.controller";

@Module({
    imports: [
        // TODO static serving should be guarded see https://docs.nestjs.com/techniques/mvc
        // Make sure no controller is bound to /, otherwise it will overwrite the static serving
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, "../../../apps/server", "public"),
        }),
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
        DataloraController,
        DockerlistController,
        DownloadlistController,
        LoginController,
        LogoutController,
        NowplayingController,
        ProfileController,
        PwToHashController,
        StatusController,
        SwitchesController,
        UrltomusicController,
    ],
    providers: [AppService],
})
export class AppModule {}
