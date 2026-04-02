import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags, ApiNotFoundResponse, ApiNoContentResponse } from "@nestjs/swagger";
import { UserService } from "@modules/users/application/service/users.service";
import { CreateUserDto, UpdateUserDto, UserDto } from "@modules/users/application/dto/user.dto";
import { Public } from "@shared/infra/decorators/public.decorator";
import { RequirePermissions } from "@shared/infra/decorators/permissions.decorator";
import { Permission } from "@shared/domain/enums/permission.enum";
import { HateoasItem, HateoasList } from "@shared/infra/hateoas";

@ApiTags("users")
@ApiBearerAuth()
@Controller("users")
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: "Listar usuários" })
  @ApiQuery({ name: "_page", required: false, type: Number })
  @ApiQuery({ name: "_size", required: false, type: Number })
  @RequirePermissions(Permission.USERS_READ)
  @HateoasList<UserDto>({
    basePath: "/users",
    itemLinks: (item) => ({
      self: { href: `/users/${item.id}`, method: "GET" },
      update: { href: `/users/${item.id}`, method: "PUT" },
      delete: { href: `/users/${item.id}`, method: "DELETE" },
    }),
  })
  async findAll(
    @Query("_page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("_size", new DefaultValuePipe(10), ParseIntPipe) size: number,
  ) {
    return this.userService.listPaginated({ page, limit: size });
  }

  @Get(":id")
  @ApiOperation({ summary: "Buscar usuário por ID" })
  @ApiNotFoundResponse({ description: "Usuário não encontrado" })
  @RequirePermissions(Permission.USERS_READ)
  @HateoasItem<UserDto>({
    basePath: "/users",
    itemLinks: (item) => ({
      self: { href: `/users/${item.id}`, method: "GET" },
      update: { href: `/users/${item.id}`, method: "PUT" },
      delete: { href: `/users/${item.id}`, method: "DELETE" },
      list: { href: "/users", method: "GET" },
      create: { href: "/users", method: "POST" },
    }),
  })
  async findById(@Param("id") id: string) {
    return this.userService.findById(id);
  }

  @Post()
  @Public()
  @ApiOperation({ summary: "Criar usuário" })
  @RequirePermissions(Permission.USERS_WRITE)
  async create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  @Put(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Atualizar usuário" })
  @ApiNoContentResponse({ description: "Usuário atualizado" })
  @ApiNotFoundResponse({ description: "Usuário não encontrado" })
  @RequirePermissions(Permission.USERS_WRITE)
  async update(@Param("id") id: string, @Body() body: UpdateUserDto) {
    return this.userService.edit(id, body);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remover usuário" })
  @ApiNoContentResponse({ description: "Usuário removido" })
  @ApiNotFoundResponse({ description: "Usuário não encontrado" })
  @RequirePermissions(Permission.USERS_DELETE)
  async remove(@Param("id") id: string) {
    return this.userService.remove(id);
  }
}
