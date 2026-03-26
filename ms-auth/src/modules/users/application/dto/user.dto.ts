import { IsEmail, IsOptional, IsString, MinLength, IsArray } from "class-validator";

export class CreateUserDto {
	@IsEmail()
	email!: string;

	@IsString()
	@MinLength(6)
	password!: string;

	@IsOptional()
	@IsString()
	teacherId?: string;

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
	@IsString()
	teacherId?: string;

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	permissions?: string[];
}

export interface UserPayload {
	id: string;
	email: string;
	permissions: string[];
}

export class UserResponseDto {
	private constructor(
		public readonly id: string,
		public readonly email: string,
		public readonly teacherId: string | null,
		public readonly permissions: string[],
		public readonly createdAt: Date,
		public readonly updatedAt: Date,
	) {}

	static from(user: User | null): UserResponseDto | null {
		if (!user || !user.id) return null;
		return new UserResponseDto(
			user.id,
			user.email,
			user.teacherId ?? null,
			user.permissions,
			user.createdAt ?? new Date(),
			user.updatedAt ?? new Date(),
		);
	}
}
