import { Module } from "@nestjs/common";
import { DrizzleService } from "../../../apps/auth/src/drizzle.service";
import { UsersService } from "./users/application/service/users.service";
import { UsersController } from "./users/infra/controllers/users.controller";

@Module({
  providers: [DrizzleService, UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
