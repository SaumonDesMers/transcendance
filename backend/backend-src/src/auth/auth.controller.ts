import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './fortytwo/fortytwo.guard';
import { JwtAuthGuard } from './jwt/jwt.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(FortyTwoAuthGuard)
	@Get('login')
	login(@Req() req: any, @Res() response: Response) {
		console.log('GET auth/login from', req.user.username)

		const jwt: string = this.authService.generateJWT(req.user)

		// see URL type
		const url = new URL(`${req.protocol}:${req.hostname}`);
		url.port = `3000`;
		url.searchParams.set('code', jwt);

		response.status(302).redirect(url.href);
	}

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	getProfile(@Req() req: any) {
		return req.user;
	}
}
