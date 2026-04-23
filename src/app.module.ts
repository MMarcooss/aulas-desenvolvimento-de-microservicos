import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SharedModule } from "@shared/shared.module";
import { AuthModule } from "@modules/auth/auth.module";
import { UsersModule } from "@modules/users/users.module";
import {MessagingModule} from "@modules/messaging/messaging.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    SharedModule,
    UsersModule,
    MessagingModule,
    AuthModule,
  ],
})
export class AppModule {}