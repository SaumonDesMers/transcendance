import { Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { ConfigService } from "@nestjs/config";
import { catchError, firstValueFrom } from "rxjs";
import { AxiosError } from "axios";

@Injectable()
export class AuthService {
	constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {}
	
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

		try {
			var res = firstValueFrom(
				this.httpService.post('https://api.intra.42.fr/oauth/token', {
					grant_type: 'authorization_code',
					client_id: uid,
					client_secret: secretKey,
					code: code,
					redirect_uri: 'http://localhost:3000'
				}).pipe(
					catchError((error: AxiosError) => {
						console.error(error.response.data);
						throw 'An error happened!';
					}),
				)
			)
			console.log(res)
		} catch(err) {
			console.log(err)
		}

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