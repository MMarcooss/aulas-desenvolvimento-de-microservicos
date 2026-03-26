import type { User } from "@modules/users/domain/models/user.entity";
import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

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

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}

export class UserResponseDto {
  private constructor(
    public id: string,
    public email: string,
    public permissions: string[],
    public createdAt: Date | undefined,
    public updatedAt: Date | undefined,
  ) {}

  static from(user: User | null): UserResponseDto | null {
    if (!user) return null;
    return new UserResponseDto(
      user.id!,
      user.email,
      user.permissions,
      user.createdAt,
      user.updatedAt,
    );
  }
}

export interface UserPayload {
  id: string;
  email: string;
  permissions: string[];
}