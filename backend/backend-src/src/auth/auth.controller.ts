import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get()
	requestAuth(@Query('code') code: number) {
		return this.authService.requestAuth(code);
	}
}
