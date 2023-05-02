import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-42'

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService,
	) {
		super({
			clientID: configService.get<string>('UID'),
			clientSecret: configService.get<string>('SECRET_KEY'),
			callbackURL: "http://localhost:3001/auth/login"
		});
	}

	async validate(accessToken, refreshToken, ft_profile, cb): Promise<any> {
		// console.log('validate:', accessToken, refreshToken)
		return ft_profile;
	}
}
