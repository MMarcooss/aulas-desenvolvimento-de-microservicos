import { Module, Global } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DrizzleService, DRIZZLE_PROVIDER } from "./infra/database/drizzle.service";

@Global()
@Module({
	imports: [ConfigModule],
	providers: [
		{
			provide: DRIZZLE_PROVIDER,
			useFactory: async (config: ConfigService) => {
				const dbUrl = config.get<string>("DATABASE_URL");
				if (!dbUrl) {
					throw new Error("DATABASE_URL not configured");
				}
				const service = new DrizzleService(dbUrl);
				return service.getDB();
			},
			inject: [ConfigService],
		},
	],
	exports: [DRIZZLE_PROVIDER],
})
export class SharedModule {}
