import { Body, Controller, Get, Post, Query, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './fortytwo/fortytwo.guard';
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
	async login(@Req() req: any, @Res({ passthrough: true }) response: Response) {
		console.log(req.user.username, 'connected with 42');

		const jwt: string = await this.authService.generateJwtWith2fa(req.user, false);

		const url = new URL(`${req.protocol}:${req.hostname}`);
		url.port = `3000`;

		response.cookie('jwt', jwt);
		response.status(302).redirect(url.href);
	}

	@Get('user')
	async getUser(@Req() req: any) {
		const user = await this.authService.getUser(parseInt(req.user.id));

		if (user && user.isTwoFactorAuthenticationEnabled && !req.user.isTwoFactorAuthenticated)
			return '2fa';

		return user;
	}

	@Post('2fa/turn-on')
	async turnOn2fa(@Req() req: any, @Res({ passthrough: true }) response: Response) {
		const tfa = await this.authService.turnOn2fa(parseInt(req.user.id));
		response.cookie('jwt', tfa.jwt);
		return tfa.qrcode;
	}

	@Post('2fa/authenticate')
	async authenticate(
		@Req() req: any,
		@Body() body: any,
		@Res({ passthrough: true }) response: Response
	) {

		const isCodeValid = await this.authService.is2faCodeValid(
			body.twoFactorAuthenticationCode,
			parseInt(req.user.id),
		);

		if (!isCodeValid)
			throw new UnauthorizedException('Wrong authentication code');

		response.cookie('jwt', await this.authService.generateJwtWith2fa(req.user, true))
		return await this.authService.getUser(parseInt(req.user.id));
	}

	@Post('2fa/turn-off')
	async turnOff2fa(@Req() req: any) {
		this.authService.turnOff2fa(parseInt(req.user.id));
	}
}
