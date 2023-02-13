import { Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { ConfigService } from "@nestjs/config";
import { catchError, firstValueFrom } from "rxjs";
import { AxiosError } from "axios";

@Injectable()
export class AuthService {
	constructor(
		private readonly httpService: HttpService,
		private readonly configService: ConfigService
	) {}
	
	requestAuth(code: number) {
		const uid: string = this.configService.get<string>('UID')
		const secretKey: string = this.configService.get<string>('SECRET_KEY')

		if (!uid || !secretKey) {
			console.error('Error loading credentials.')
			return {
				auth: false,
				error: 'There is a server side error with credentials.'
			}
		}

		const FortyTwoStrategy = require('passport-42').Strategy

		passport.use(new FortyTwoStrategy({
				clientID: uid,
				clientSecret: secretKey,
				callbackURL: "http://127.0.0.1:3000/auth/42/callback"
			},
			function(accessToken, refreshToken, profile, cb) {
				User.findOrCreate({ fortytwoId: profile.id }, function (err, user) {
					return cb(err, user);
				});
			}
		));
		

		return {
			auth: true
		}
	}
}

// curl -F grant_type=authorization_code \
// -F client_id=u-s4t2ud-83a9e79a18485926a5999f8d21d7a446e76d4e9e3cda5ac0c65f0198f390f2d0 \
// -F client_secret=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 \
// -F code=376261dd8439790d52c522e2af5c0c8a68fec12f1b5ea29f8710a6546f387827 \
// -F redirect_uri=http://localhost:3000 \
// -X POST https://api.intra.42.fr/oauth/token