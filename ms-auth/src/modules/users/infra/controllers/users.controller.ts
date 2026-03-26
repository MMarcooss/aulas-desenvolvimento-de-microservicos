import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards,
} from "@nestjs/common";
import { CreateUserDto, UpdateUserDto } from "@users/application/dto/user.dto";
import { UserService } from "@users/application/services/user.service";
import { JwtAuthGuard } from "@auth/infra/guards/jwt-auth.guard";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
	constructor(private readonly userService: UserService) {}

	@Post()
	async create(@Body() dto: CreateUserDto) {
		await this.userService.create(dto);
		return { message: "User created successfully" };
	}

	@Get()
	async findAll() {
		return this.userService.list();
	}

	@Get(":id")
	async findOne(@Param("id") id: string) {
		const user = await this.userService.findById(id);
		if (!user) {
			return { message: "User not found" };
		}
		return user;
	}

	@Patch(":id")
	async update(@Param("id") id: string, @Body() dto: UpdateUserDto) {
		await this.userService.edit(id, dto);
		return { message: "User updated successfully" };
	}

	@Delete(":id")
	async remove(@Param("id") id: string) {
		await this.userService.remove(id);
		return { message: "User deleted successfully" };
	}
}
