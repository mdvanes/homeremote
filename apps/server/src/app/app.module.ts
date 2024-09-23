import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AuthModule } from "../auth/auth.module";
import { CarTwinController } from "../cartwin/cartwin.controller";
import { DataloraController } from "../datalora/datalora.controller";
import { DockerlistController } from "../dockerlist/dockerlist.controller";
import { DownloadlistController } from "../downloadlist/downloadlist.controller";
import { EnergyUsageController } from "../energyusage/energyusage.controller";
import { HomesecController } from "../homesec/homesec.controller";
import { JukeboxController } from "../jukebox/jukebox.controller";
import { LoginController } from "../login/login.controller";
import { LogoutController } from "../logout/logout.controller";
import { MonitController } from "../monit/monit.controller";
import { NextupController } from "../nextup/nextup.controller";
import { NowplayingController } from "../nowplaying/nowplaying.controller";
import { ProfileController } from "../profile/profile.controller";
import { PwToHashController } from "../pw-to-hash/pw-to-hash.controller";
import { ScheduleController } from "../schedule/schedule.controller";
import { ServiceLinksController } from "../service-links/service-links.controller";
import { SmartEntitiesController } from "../smart-entities/smart-entities.controller";
import { SpeedtestController } from "../speedtest/speedtest.controller";
import { StacksController } from "../stacks/stacks.controller";
import { StatusController } from "../status/status.controller";
import { SwitchesController } from "../switches/switches.controller";
import { UrltomusicController } from "../urltomusic/urltomusic.controller";
import { UsersModule } from "../users/users.module";
import { VideoStreamController } from "../video-stream/video-stream.controller";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
    imports: [
        // TODO static serving should be guarded see https://docs.nestjs.com/techniques/mvc
        // Make sure no controller is bound to /, otherwise it will overwrite the static serving
        ServeStaticModule.forRoot({
            // Dev: rootPath: join(__dirname, "../", "assets"),
            rootPath: join(__dirname, "assets"),
        }),
        AuthModule,
        UsersModule,
        ConfigModule.forRoot(),
        // TODO ConfigModule can also use a yaml instead of a .env file
        // ConfigModule.forRoot({
        //     validationSchema: Joi.object({
        //         STATUS_CMD: Joi.string().default("echo 'test status cmd'"),
        //         SOME_VAR: Joi.string().required,
        //     }),
        // }),
    ],
    controllers: [
        AppController,
        CarTwinController,
        DataloraController,
        DockerlistController,
        DownloadlistController,
        EnergyUsageController,
        HomesecController,
        JukeboxController,
        LoginController,
        LogoutController,
        MonitController,
        NextupController,
        NowplayingController,
        ProfileController,
        PwToHashController,
        ScheduleController,
        ServiceLinksController,
        SmartEntitiesController,
        SpeedtestController,
        StacksController,
        StatusController,
        SwitchesController,
        UrltomusicController,
        VideoStreamController,
    ],
    providers: [AppService],
})
export class AppModule {}
