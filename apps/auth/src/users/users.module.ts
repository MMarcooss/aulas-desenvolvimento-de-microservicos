import { Module } from "@nestjs/common";
import { DrizzleService } from "../drizzle.service";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";

@Module({
  providers: [DrizzleService, UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
