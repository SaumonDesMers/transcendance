import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/User.service';

@Injectable()
export class Jwt2faStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
	constructor(private readonly userService: UserService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: 'secret',
		});
	}

	async validate(payload: any) {
		const user = await this.userService.getOneUser(payload.id);

		if (!user.isTwoFactorAuthenticationEnabled) {
			return user;
		}
		if (payload.isTwoFactorAuthenticated) {
			return user;
		}
	}
}