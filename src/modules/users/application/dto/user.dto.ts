import type { User } from "@modules/users/domain/models/user.entity";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

// DTO de entrada (com validação)
export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}

// DTO de resposta (sem validação — construtor privado + static from)
export class UserDto {
  @ApiProperty({ type: String, nullable: true })
  public id: string | undefined;

  @ApiProperty()
  public email: string;

  @ApiProperty({ type: [String] })
  public permissions: string[];

  @ApiProperty({ type: Date, nullable: true })
  public createdAt: Date | undefined;

  @ApiProperty({ type: Date, nullable: true })
  public updatedAt: Date | undefined;

  private constructor(
    id: string | undefined,
    email: string,
    permissions: string[],
    createdAt: Date | undefined,
    updatedAt: Date | undefined,
  ) {
    this.id = id;
    this.email = email;
    this.permissions = permissions;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromUser(user: User | null): UserDto | null {
    if (!user) return null;
    return new UserDto(
      user.id,
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