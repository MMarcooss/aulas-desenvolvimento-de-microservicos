import { Body, Controller, Get, Post, Query, Req, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./auth.dto";
import { Public } from "./public.decorator";
import { AuthenticatedUser } from "./jwt.guard";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post("login")
  @Public()
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Get("me")
  async me(@Req() req: Request & { user: AuthenticatedUser }) {
    return req.user;
  }

  @Get("validate")
  @Public()
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
