import { Module } from "@nestjs/common";
import { SharedModule } from "@shared/shared.module";
import { UserService } from "@modules/users/application/services/user.service";
import { USER_REPOSITORY } from "@modules/users/domain/repositories/user-repository.interface";
import { UsersController } from "@modules/users/infra/controllers/users.controller";
import { DrizzleUserRepository } from "@modules/users/infra/repositories/drizzle-user.repository";

@Module({
  imports: [SharedModule],
  controllers: [UsersController],
  providers: [
    UserService,
    DrizzleUserRepository,
    {
      provide: USER_REPOSITORY,
      useExisting: DrizzleUserRepository,
    },
  ],
  exports: [UserService],
})
export class UsersModule {}