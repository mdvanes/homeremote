import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { LoginController } from "../login/login.controller";
import { ProfileController } from "../profile/profile.controller";
import { PwToHashController } from "../pw-to-hash/pw-to-hash.controller";
import { UsersModule } from "../users/users.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
    imports: [
        AuthModule,
        UsersModule,  
    ],
    controllers: [
        AppController,
        ProfileController,
        LoginController,
        PwToHashController,
    ],
    providers: [AppService],
})
export class AppModule {}
