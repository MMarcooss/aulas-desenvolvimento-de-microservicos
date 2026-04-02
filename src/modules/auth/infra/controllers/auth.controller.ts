import { Body, Controller, Get, Post, Query, Req, UnauthorizedException } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { AuthService } from "@modules/auth/application/service/auth.service";
import { LoginDto } from "@modules/auth/application/dto/auth.dto";
import { Public } from "@shared/infra/decorators/public.decorator";
import type { AuthenticatedUser } from "@shared/infra/decorators/current-user.decorator";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post("login")
  @Public()
  @ApiOperation({ summary: "Autenticar usuário" })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Get("me")
  @ApiOperation({ summary: "Obter usuário autenticado" })
  async me(@Req() req: Request & { user: AuthenticatedUser }) {
    return req.user;
  }

  @Get("validate")
  @Public()
  @ApiOperation({ summary: "Validar token JWT" })
  @ApiQuery({ name: "token", required: true, type: String })
  @ApiUnauthorizedResponse({ description: "Token inválido ou não fornecido" })
  async validate(@Query("token") token: string) {
    if (!token) throw new UnauthorizedException("Token required");
    try {
      const payload = await this.jwtService.verifyAsync<AuthenticatedUser>(
        token,
        { secret: process.env.JWT_SECRET },
      );
      return { valid: true, user: payload };
    } catch {
      throw new UnauthorizedException("Invalid token");
    }
  }
}