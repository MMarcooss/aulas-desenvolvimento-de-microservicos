import { AuthModule } from "@auth/auth.module";
import { SharedModule } from "@shared/shared.module";
import { UsersModule } from "@users/users.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ".env",
		}),
		SharedModule,
		UsersModule,
		AuthModule,
	],
})
export class AppModule {}
