import { IsArray, IsEmail, IsOptional, IsString, MinLength } from "class-validator";
import { User } from "./user.entity";

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}

export class UserResponseDto {
  id: string;
  email: string;
  permissions: string[];
  createdAt: Date | undefined;
  updatedAt: Date | undefined;

  static from(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id!;
    dto.email = user.email;
    dto.permissions = user.permissions;
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;
    return dto;
  }
}
