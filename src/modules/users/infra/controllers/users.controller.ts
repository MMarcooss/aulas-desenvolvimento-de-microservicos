import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { UserService } from "@modules/users/application/service/users.service";
import { CreateUserDto, UpdateUserDto } from "@modules/users/application/dto/user.dto";
import { Public } from "@shared/infra/decorators/public.decorator";

@Controller("users")
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return this.userService.list();
  }

  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.userService.findById(id);
  }

  @Post()
  @Public()
  async create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() body: UpdateUserDto) {
    return this.userService.edit(id, body);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.userService.remove(id);
  }
}