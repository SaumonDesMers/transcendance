import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Strategy } from 'passport-42'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService,
		private readonly authService: AuthService
	) {
		super({
			clientID: configService.get<string>('UID'),
			clientSecret: configService.get<string>('SECRET_KEY'),
			callbackURL: "http://127.0.0.1:3000/auth/42/callback"
		});
	}

	async validate(accessToken, refreshToken, profile, cb): Promise<any> {
		this.authService.validateUser(accessToken, refreshToken, profile, function (err, user) {
			return cb(err, user);
		});
	}
}
