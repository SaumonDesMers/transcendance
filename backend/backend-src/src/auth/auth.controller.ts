import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
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
		return await this.authService.getUser(req.user.id);
	}
}
