import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './fortytwo.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(FortyTwoAuthGuard)
	@Get('login')
	login(@Req() req: any, @Res() response: Response) {
		// return this.authService.requestAuth(code);
		// console.log(req.user)
		// const url = new URL(`${req.protocol}:${req.hostname}`);
		// url.port = process.env.FRONT_PORT;
		// url.pathname = 'login';
		// url.searchParams.set('code', token);
		// console.log(url.href)

		// response.status(302).redirect(url.href);
	}
}
