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

		let user = await this.authService.getUser(parseInt(req.user.id));
		if (!user)
			user = req.user;

		const jwt: string = await this.authService.generateJwtWith2fa(user, false);

		const url = new URL(`${req.protocol}:${req.hostname}`);
		url.port = `3000`;
		url.searchParams.set('code', jwt);

		response.status(302).redirect(url.href);
	}

	@Get('user')
	@ApiOkResponse({ type: UserEntity })
	async getUser(@Req() req: any) {
		console.log('auth/user: req.user:', req.user);
		if (req.user.isTwoFactorAuthenticationEnabled && !req.user.isTwoFactorAuthenticated) {
			return '2fa';
		}
		return await this.authService.getUser(parseInt(req.user.id));
	}

	@Post('2fa/turn-on')
	async turnOn2fa(@Req() req: any) {
		console.log('2fa/turn-on');
		return await this.authService.turnOn2fa(parseInt(req.user.id));
	}

	@Post('2fa/authenticate')
	@ApiOkResponse({ type: String })
	async authenticate(@Req() req: any, @Body() body: any) {
		console.log('2fa/authenticate');
		const isCodeValid = await this.authService.is2faCodeValid(
			body.twoFactorAuthenticationCode,
			parseInt(req.user.id),
		);

		if (!isCodeValid)
			throw new UnauthorizedException('Wrong authentication code');

		return this.authService.generateJwtWith2fa(req.user, true);
	}

	@Post('2fa/turn-off')
	async turnOff2fa(@Req() req: any) {
		console.log('2fa/turn-off');
		this.authService.turnOff2fa(parseInt(req.user.id));
	}
}
