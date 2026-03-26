import { LoginDto } from "@auth/application/dto/auth.dto";
import { AuthService } from "@auth/application/services/auth.service";
import { Body, Controller, Get, Headers, Post } from "@nestjs/common";
import { Public } from "@shared/infra/decorators/public.decorator";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("login")
	@Public()
	async login(@Body() body: LoginDto) {
		return this.authService.login(body);
	}

	@Get("validate")
	@Public()
	async validate(@Headers("authorization") authHeader: string) {
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return { valid: false };
		}
		const token = authHeader.substring(7);
		const payload = await this.authService.validateToken(token);
		return {
			valid: !!payload,
			user: payload,
		};
	}
}
