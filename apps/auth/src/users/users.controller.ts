import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto, UserResponseDto } from "./user.dto";
import { Public } from "../auth/public.decorator";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  async create(@Body() body: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(body);
    return UserResponseDto.from(user);
  }

  @Get(":id")
  async findById(@Param("id") id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findById(id);
    return UserResponseDto.from(user);
  }
}
