import { Body, Controller, Get, Post, Query, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './fortytwo/fortytwo.guard';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { Public } from './public.decorator';
import { HttpStatus } from '@nestjs/common';
import { ApiNoContentResponse, ApiOkResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/user/User.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@UseGuards(FortyTwoAuthGuard)
	@Get('login')
	async login(@Req() req: any, @Res() response: Response) {
		console.log(req.user.username, 'connected with 42');

		const jwt: string = await this.authService.generateJWT(req.user);

		// see URL type
		const url = new URL(`${req.protocol}:${req.hostname}`);
		url.port = `3000`;
		url.searchParams.set('code', jwt);

		response.status(302).redirect(url.href);
	}

	@Get('user')
	@ApiOkResponse({ type: UserEntity })
	async getUser(@Req() req: any) {
		return await this.authService.getUser(parseInt(req.user.id));
	}

	@Post('2fa/turn-on')
	async turnOnTwoFactorAuthentication(@Req() req: any, @Body() body: any) {
		console.log('2fa/turn-on');
		// console.log('authorization =', req.headers);
		// const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
		// 	body.twoFactorAuthenticationCode,
		// 	req.user,
		// );

		// if (!isCodeValid)
		// 	throw new UnauthorizedException('Wrong authentication code');

		return await this.authService.turnOnTwoFactorAuthentication(parseInt(req.user.id));
	}

	@Post('2fa/authenticate')
	async authenticate(@Req() req: any, @Body() body: any) {
		console.log('2fa/authenticate');
		const isCodeValid = await this.authService.isTwoFactorAuthenticationCodeValid(
			body.twoFactorAuthenticationCode,
			parseInt(req.user.id),
		);

		if (!isCodeValid)
			throw new UnauthorizedException('Wrong authentication code');

		return this.authService.generateJwtWith2fa(req.user);
	}
}
